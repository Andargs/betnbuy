from flask import Flask, jsonify, g, request, escape, session
import sqlite3
import random
from werkzeug.security import generate_password_hash, check_password_hash
from setup_db import add_user, add_product, filter_product, passwordcheck,get_user_tickets, get_all_products, spend_tickets, delete_prod, pick_winner,filter_product, get_id
import json
from werkzeug.utils import secure_filename
import os
import io
import PIL.Image as Image
from array import array
from subprocess import Popen, PIPE

UPLOAD_FOLDER = './static/images/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'ext', 'txt'}

app = Flask(__name__)
app.config.from_object(__name__)
app.config['./static/images/'] = UPLOAD_FOLDER

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'



DATABASE = './database.db'

#Validates login
def valid_login(username, password):
    if username is not None:
        return check_password_hash(username,password)
    return False


#Gets the database
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


#Handles the data and gives it back in a more managable format.
def handle_data(string):
    string = str(string)
    string = string.split("&")
    string[0]=string[0].replace('b\'', '')
    string[-1]=string[-1].replace('\'', '')
    fullList= []
    if len(string) == 4:
        for element in string:
            element=element.split('=')[1]
            fullList.append(element)
    if len(string) == 3:
        for element in string:
            element = element.split('=')[1]
            fullList.append(element)
    if len(string) == 2:
        for element in string:
            element = element.split('=')[1]
            fullList.append(element)
    if len(string) == 6:
        for element in string:
            element = element.split('=')[1]
            fullList.append(element)
    return fullList

#Handle delete fetch
def handle_one_element(string):
    string = str(string)
    string = string.split('=')[1]
    string = string.replace('\'','')
    return string

#removes currentuserdata global value and removes the users ability to access sites without loging in again
def removeuserinfo():
    global currentuserdata
    del currentuserdata

def remove_filter():
    global current_filter
    current_filter = []
    del current_filter









####################LOGIN PAGE#############################
#Handles login
@app.route("/", methods=['POST', 'GET'])
def home():
    #hent db
    conn = get_db()
    data = request.get_data()
    if data is not None:
        data = handle_data(data)
    print(data)
    if data:
        #Makes sure all values are filled in
        if len(data) ==2:
            try:
                #escapes the data
                username = escape(data[0])
                password = escape(data[1])
                if username is not None and password is not None:
                    try:
                        #checks the password
                        useraccesed = passwordcheck(conn, username)
                        if len(useraccesed) <1:
                            return jsonify('No user by that name')
                        #checks that the user and password are authorized
                        if username == useraccesed[0][0] and check_password_hash(useraccesed[0][1],password):
                            session['username'] = username
                            #Creates a global value with the current user, then extracts the username, their products and their tickets
                            global currentuserdata
                            currentuserdata = [username]
                            tickets = get_user_tickets(conn, username)
                            currentuserdata.append(tickets[0])
                            currentuser = {
                                "username": useraccesed[0][0],
                            }
                            return jsonify(currentuser)
                        else:
                            return jsonify('Wrong password')
                    except SyntaxError:
                        return jsonify('No user by that name')
            except SyntaxError:
                pass
    
    return app.send_static_file("home.html")

######################REGISTER PAGE##########################
#Registers users
@app.route('/register', methods=['POST'])
def register():
    conn = get_db()
    data = request.get_data()
    if data is not None:
        data = handle_data(data)
    if data:
        if len(data) > 2:
            usernameregister = escape(data[0])    #escapes data, not really necessary for a test run, but would be in a real environment
            emailregister = escape(data[1])     #therefore only done here
            passwordregister = escape(data[2])
            passwordconf = escape(data[3])
            if request.method == "POST" and usernameregister is not None:
                #makes sure the password is long enough and password and passwordregister is the same
                if len(str(passwordregister)) >= 5 and passwordregister == passwordconf:
                    id = add_user(conn, usernameregister, generate_password_hash(passwordregister), emailregister)
                    if id != -1:
                        return jsonify('User created')
                    else:
                        return jsonify('Username already in use')
                else:
                    return jsonify('Password and password confirmation must match, and password must be 5 characters or longer')

    
    return app.send_static_file("home.html")

####################HOME PAGE################################
#Checks that the user is logged in, and gives the #home page the products which it will then show
@app.route('/home', methods=['POST'])
def user():
    conn = get_db()
    #If the user is logged in, this will return the users data to the mainpage along with the products
    #If the user is not logged in, the page will redirect the user back to the login site.
    try:
        if current_filter is not None:  #Checks if the user has already filtered products
            product = filter_product(conn, current_filter)  #if the user has filtered before, the filter will be applied and only
            #filtered products will be shown
            return jsonify(currentuserdata, product)
    except NameError as e:
        print(e)
    try:
        if currentuserdata:
            if currentuserdata != None:
                product = get_all_products(conn)
                return jsonify(currentuserdata, product)
    except NameError:
        return json.dumps("Redirect")
    
    return app.send_static_file('home.html')


#Takes the filter variables from js, sends it to retrieve the correct data from the database, and returns it
@app.route('/filter', methods=['POST'])
def filter():
    conn = get_db()
    filter = request.get_data()
    filter = handle_one_element(filter)
    filterlist = []
    filterlist.append(filter.split(','))
    if filter[0][0] == ",":
        del filterlist[0][0]    #Removes redundant elements from the filter value given and cleans it up before accessing the database
    global current_filter
    current_filter = filterlist       #Sets the filterdata as a global value, so it can be used when the user opens #home again
    productfilter = filter_product(conn, filterlist)
    if len(productfilter) <= 1 and type(productfilter) == str:
        del current_filter
        return json.dumps("No product fits the filter options choosen")
    else:
        return jsonify(productfilter)

#Retrieves how many tickets which user wants to use on which product, and sends it to the database for confirmation and updating
@app.route('/payprod', methods=['POST'])
def pay():
    conn = get_db()
    product = request.get_data()     #Gets the product id and how much money is spent
    product = handle_data(product) #Turns data into a more managable type
    product[1] = int(product[1])
    if product[1] < 0:
        return json.dumps("Cant spend negative tickets")
    if currentuserdata[1][0] < product[1]:  #Checks that the user have enough tickets to perform the buy operation
        return json.dumps("You dont have enough tickets to perform this transaction")
    else:
        #Applies the changes to the database
        answer = spend_tickets(conn, currentuserdata[0], product[0], product[1])
        if answer == "Sold":
            return json.dumps("Cant spend tickets on an already sold item")
        #Updates the users info about itself
        tickets = get_user_tickets(conn, currentuserdata[0])
        currentuserdata[1] = tickets[0]
        return jsonify("Refresh")


#Retrieves data from js with which product should be deleted, and checks if the user is allowed to delete the product selected
@app.route('/deleteprod', methods=['POST'])
def delete():
    
    conn = get_db()
    prodid = request.get_data()
    prodid = handle_one_element(prodid)
    answer = delete_prod(conn, currentuserdata[0], prodid)
    tickets = get_user_tickets(conn, currentuserdata[0])
    currentuserdata[1] = tickets[0]   #updates the users tickets incase they spent tickets on their own product
    if answer == "Right":
        return jsonify("Product is deleted")        #All checks worked and the product is deleted.
    elif answer == "Wrong":
        return jsonify("Product cant be deleted by someone who doesnt own the product") #The user doesnt own the product and cant delete it
    elif answer == "Sold":
        return jsonify("Cant delete a product thats already sold")  #The products status is 1, ergo the product is sold, and therefore cant be deleted

#Retrieves which products time is up, sends the productid to the database to either pick winner and send tickets to the right user,
#or find out that no winner should be selected, and send the tickets back to all users who spent tickets on it
@app.route('/choosewinner', methods=['POST'])
def choosewinner():
    conn = get_db()
    product = request.get_data()   #Retrieves data
    product = handle_data(product)  #Manages data
    answer = pick_winner(conn,product[0],product[1],product[2])  #Checks if the winner can be selected
    #if a winner can be selected, winner is returned, if not, it returns something that tells the js what to do
    tickets = get_user_tickets(conn, currentuserdata[0])
    currentuserdata[1] = tickets[0]
    if answer:
        return json.dumps(answer)

#################################REGISTER PRODUCTS PAGE######################################
#Adds the product the user created to the main page
@app.route('/products', methods=['POST'])
def products():
    conn = get_db()
    product = request.get_data()
    product = handle_data(product)
    add_product(conn,product[1],product[0],product[2],int(product[3]),currentuserdata[0],product[4],product[5])  #Sends the product data to the backend for
    #adding to the database
    
    if product:
        return json.dumps('Product created')    #Product is created, this message will reroute the user to #home
    else:
        return json.dumps("An error occured, try again") #An error occured.

#Processes the image and saves it with the correct id
@app.route('/imageprocessing', methods=['POST'])
def imageproc():
    conn = get_db()
    img = request.get_data()
    img = Image.open(io.BytesIO(img))
    id = get_id(conn)       #Gets the products id
    if img:
        id = str(id)
        navn = f"{id}img"
        img.save('./static/images/'+f'{navn}.png', 'PNG')  #Uses the images id to make frontend images easier to handle
        
        
    return ""


#############################LOGOUT FUNCTION###################################
#Logs the user out and redirects them to the login page
@app.route('/logout', methods=['POST'])
def logout():
    request.get_data()
    remove_filter()
    removeuserinfo()
    
    return "redirect"

#Chooses a random port for the user to run the app on
if __name__ == '__main__':
    app.run(debug=True)
