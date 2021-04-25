from flask import Flask, jsonify, render_template, g, request, flash, escape, session, redirect
import sqlite3
from datetime import datetime
import random
from werkzeug.security import generate_password_hash, check_password_hash
from setup_db import add_user, add_product, setup, passwordcheck, get_user
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
                            flash('User isnt registered, register and try again')
                        if username == useraccesed[0][0] and check_password_hash(useraccesed[0][1],password):
                            print("Login approved")
                            flash('Login approved')
                            session['username'] = username
                            global currentuserdata
                            currentuserdata = get_user(conn, username)
                            print(useraccesed[0][0])
                            currentuser = {
                                "username": useraccesed[0][0],
                            }
                            #print(json.dumps(useraccesed[0][0]))
                            return json.dumps(currentuser)
                        else:
                            print("login failed")
                            flash('Wrong password')
                            return json.dumps('False')
                    except SyntaxError:
                        flash('No users by that name')
            except SyntaxError:
                pass
    
    ####################################REGISTER FUNCTIONS######################################################
    # if data:
    #     if len(data) > 2:
    #         usernameregister = escape(data[0])
    #         emailregister = escape(data[1])
    #         passwordregister = escape(data[2])
    #         passwordconf = escape(data[3])
    #         print(str(usernameregister), str(emailregister), str(passwordregister), str(passwordconf))
    #         if request.method == "POST" and usernameregister is not None:
    #             if len(str(passwordregister)) > 5 and passwordregister == passwordconf:
    #                 id = add_user(conn, usernameregister, generate_password_hash(passwordregister), emailregister)
    #                 if id != -1:
    #                     flash("USER CREATED")
    #                     print('USER CREATED')
    #                 else:
    #                     flash('Username already taken')
    #                     print('USERNAME ALREADY TAKEN')
    #             else:
    #                 flash("CONFPASS AND PASSWORD NOT ALIKE")
    
    return app.send_static_file("home.html")

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
                if len(str(passwordregister)) > 5 and passwordregister == passwordconf:
                    id = add_user(conn, usernameregister, generate_password_hash(passwordregister), emailregister)
                    if id != -1:
                        flash("USER CREATED")
                        print('USER CREATED')
                    else:
                        flash('Username already taken')
                        print('USERNAME ALREADY TAKEN')
                else:
                    flash("CONFPASS AND PASSWORD NOT ALIKE")
    
    return app.send_static_file("home.html")

@app.route('/home', methods=['POST'])
def user():
    conn = get_db()
    #om brukeren har logget inn sender den brukerens data sånn at brukeren kan se hva som har skjedd.
    #Hvis brukeren ikke har logget inn vil brukeren bli redirecta tilbake til start
    if currentuserdata:
        return json.dumps(currentuserdata)
    else:
        return json.dumps("Redirect")
    

    
    
    return app.send_static_file('home.html')


@app.route('/product', methods=['POST'])
def product():
    conn = get_db()
    #om brukeren har logget inn sender den brukerens data sånn at brukeren kan se hva som har skjedd.
    #Hvis brukeren ikke har logget inn vil brukeren bli redirecta tilbake til start
    if currentuserdata:
        return json.dumps(currentuserdata)
    else:
        return json.dumps("Redirect")


if __name__ == '__main__':
    app.run(debug=True)
