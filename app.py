from flask import Flask, jsonify, render_template, g, request, flash
import sqlite3
from datetime import datetime
import random
from werkzeug.security import generate_password_hash, check_password_hash
from setup_db import add_user, add_product, setup, passwordcheck
import json

app = Flask(__name__)
app.config.from_object(__name__)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'



DATABASE = './database.db'

def valid_login(username, password):
    if username is not None:
        return check_password_hash(username,password)
    return False

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

#Handles the data and gives it back in a managable format. Request.get_json doesnt respond well with the js router, so i had to improvise
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
    if len(string) == 2:
        for element in string:
            element = element.split('=')[1]
            fullList.append(element)
    return fullList







@app.route("/", methods=['POST', 'GET'])
def home():
    #hent db
    conn = get_db()
    ###################################LOGIN FUNCTIONS#######################################################
    data = request.get_data()
    if data is not None:
        data = handle_data(data)
    print(data)
    if data:
        if len(data) ==2:
            try:
                username = data[0]
                password = data[1]
                if username is not None and password is not None:
                    try:
                        useraccesed = passwordcheck(conn, username)
                        print(useraccesed)
                        if len(useraccesed) <1:
                            flash('User isnt registered, register and try again')
                        if username == useraccesed[0][0] and check_password_hash(useraccesed[0][1],password):
                            print("Login approved")
                            flash('Login approved')
                            return jsonify(useraccesed[0][0])
                        else:
                            print("login failed")
                            flash('Wrong password')
                    except SyntaxError:
                        flash('No users by that name')
            except SyntaxError:
                pass
    
    ####################################REGISTER FUNCTIONS######################################################
    if data:
        if len(data) > 2:
            usernameregister = data[0]
            emailregister = data[1]
            passwordregister = data[2]
            passwordconf = data[3]
            print(str(usernameregister), str(emailregister), str(passwordregister), str(passwordconf))
            if request.method == "POST" and usernameregister is not None:
                if len(str(passwordregister)) > 5 and passwordregister == passwordconf:
                    add_user(conn, usernameregister, generate_password_hash(passwordregister), emailregister)
                    print("USER CREATED")
                else:
                    print("CONFPASS AND PASSWORD NOT ALIKE")
    #Funksjoner gjort i #register route
    # if route == '#register':
    #     if request.method == 'POST':
    #         usernameregister = request.form.get('username')
    #         emailregister = request.form.get('email')
    #         passwordregister = request.form.get('passwordreg')
    #         passwordconf = request.form.get('confpass')
    #         print(str(usernameregister), str(emailregister), str(passwordregister), str(passwordconf))
    #         if len(str(passwordregister)) > 5:
    #             if passwordregister == passwordconf:
    #                 add_user(conn, usernameregister, passwordregister, emailregister)
    #                 print("#########USER CREATED#############")
    #         else:
    #             flash('Password and password confirmation must match')
    #             print("IKKE LIKT PASSORD I BEGGE LINJER")
    # #Funksjoner i "/" route
    # if route == '/':
    #     if request.method == 'POST':
    #         print("Login form")
    #         username = request.form.get('username')
    #         password = request.form.get('password')
    #         print(username,password)
    
    return app.send_static_file("home.html")



if __name__ == '__main__':
    app.run(debug=True)
