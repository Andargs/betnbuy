from flask import Flask, jsonify, g, request, flash, escape, session
import sqlite3
import random
from werkzeug.security import generate_password_hash, check_password_hash
from setup_db import add_user, add_product, filter_product, passwordcheck,get_user_tickets, get_all_products, spend_tickets, delete_prod, pick_winner,filter_product
import json

app = Flask(__name__)
app.config.from_object(__name__)

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

#handle user input with commas and colons and converts it to actually readable formats
def handle_listdata(list):
    list = str(list)
    list=list.split("&")
    list[0]=list[0].replace('b\'','')
    list[-1]=list[-1].replace('\'','')
    for element in list:
        element = element.split('=')[1]
        element = element.replace('+',' ')
        element = element.replace('%2C', ',')
        element = element.replace('%3A', ':')
        print(element)
    return list

def handle_binary(binarystring):
    binarystring = binarystring.split('&')
    print(binarystring)

def read_img(img):
    img = bytes(img)
    with open(f'{img}', 'rb') as file:
        blob = file.read()
    return blob


def removeuserinfo():
    global currentuserdata
    del currentuserdata








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
        if len(data) ==2:
            try:
                username = escape(data[0])
                password = escape(data[1])
                if username is not None and password is not None:
                    try:
                        useraccesed = passwordcheck(conn, username)
                        print(useraccesed)
                        if len(useraccesed) <1:
                            return jsonify('No user by that name')
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
                            #print(json.dumps(useraccesed[0][0]))
                            return jsonify(currentuser)
                        else:
                            return jsonify('Wrong password')
                    except SyntaxError:
                        return jsonify('No user by that name')
            except SyntaxError:
                pass
    
    return app.send_static_file("home.html")


#Registers users
@app.route('/register', methods=['POST'])
def register():
    conn = get_db()
    data = request.get_data()
    if data is not None:
        data = handle_data(data)
    if data:
        if len(data) > 2:
            usernameregister = escape(data[0])
            emailregister = escape(data[1])
            passwordregister = escape(data[2])
            passwordconf = escape(data[3])
            print(str(usernameregister), str(emailregister), str(passwordregister), str(passwordconf))
            if request.method == "POST" and usernameregister is not None:
                if len(str(passwordregister)) >= 5 and passwordregister == passwordconf:
                    id = add_user(conn, usernameregister, generate_password_hash(passwordregister), emailregister)
                    if id != -1:
                        return jsonify('User created')
                    else:
                        return jsonify('Username already in use')
                else:
                    return jsonify('Password and password confirmation must match, and password must be 5 characters or longer')

    
    return app.send_static_file("home.html")

@app.route('/home', methods=['POST'])
def user():
    conn = get_db()
    #If the user is logged in, this will return the users data to the mainpage along with the products
    #If the user is not logged in, the page will redirect the user back to the login site.
    try:
        if currentuserdata:
            if currentuserdata != None:
                product = get_all_products(conn)
                return jsonify(currentuserdata, product)
    except NameError:
        return json.dumps("Redirect")
    
    return app.send_static_file('home.html')

#Adds the product the user created to the main page
@app.route('/products', methods=['POST'])
def products():
    conn = get_db()
    product = request.get_data()
    product = handle_data(product)
    #product[0] = read_img(product[0])
    #print(type(product[0]))
    #print(product[0])
    add_product(conn,product[1],product[0],product[2],int(product[3]),currentuserdata[0],product[4],product[5])
    
    if product:
        return json.dumps('HERREKVELD')

    return app.send_static_file('home.html')

@app.route('/filter', methods=['POST'])
def filter():
    conn = get_db()
    filter = request.get_data()
    filter = handle_one_element(filter)
    filterlist = []
    filterlist.append(filter.split(','))
    if filter[0][0] == ",":
        del filterlist[0][0]
    print(filterlist)
    productfilter = filter_product(conn, filterlist)
    if len(productfilter) <= 1:
        return jsonify("No product fits the filter options choosen")
    else:
        return jsonify(productfilter)


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
        print(tickets)
        return jsonify("Refresh")

@app.route('/deleteprod', methods=['POST'])
def delete():
    
    conn = get_db()
    prodid = request.get_data()
    prodid = handle_one_element(prodid)
    answer = delete_prod(conn, currentuserdata[0], prodid)
    tickets = get_user_tickets(conn, currentuserdata[0])
    currentuserdata[1] = tickets[0]
    if answer == "Right":
        #Dont need to update tickets due to this being the users own product
        return jsonify("Product is deleted")
    elif answer == "Wrong":
        return jsonify("Product cant be deleted by someone who doesnt own the product")
    elif answer == "Sold":
        return jsonify("Cant delete a product thats already sold")

@app.route('/choosewinner', methods=['POST'])
def choosewinner():
    conn = get_db()
    product = request.get_data()   #Retrieves data
    product = handle_data(product)  #Manages data
    answer = pick_winner(conn,product[0],product[1],product[2], currentuserdata[0])  #Checks if the winner can be selected
    #if a winner can be selected, winner is returned, if not, it returns something that tells the js what to do
    tickets = get_user_tickets(conn, currentuserdata[0])
    currentuserdata[1] = tickets[0]
    if answer:
        return json.dumps(answer)

@app.route('/logout', methods=['POST'])
def logout():
    logout = request.get_data()
    removeuserinfo()
    
    return "redirect"


if __name__ == '__main__':
    port = 5000 + random.randint(0, 999)
    print(port)
    url = "http://127.0.0.1:{0}".format(port)
    print(url)
    app.run(use_reloader=False, debug=True, port=port)
    #app.run(debug=True)
