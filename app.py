from flask import Flask, jsonify, render_template, g, request, flash
import sqlite3
from datetime import datetime
import random
from werkzeug.security import generate_password_hash, check_password_hash
from setup_db import add_user, add_product
import json

app = Flask(__name__)
app.config.from_object(__name__)

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'



DATABASE = './database.db'


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






@app.route("/", methods=['POST', 'GET'])
def home():
    #hent db
    conn = get_db()
    #Finn nåværende url for å kunne gjennomføre forms og hente/sende riktig info i riktig form
    
    currwind = request.url_rule
    

    #Funksjoner gjort i #register route
    print("VI ER HER")
    if 'register' in currwind.rule:
        print("dette er register")
    
    #if currwind == '/#register':
        if request.method == 'POST':
            print("OOOOOOOOOOOOOOOOOOOI")
            usernameregister = request.form['username']
            emailregister = request.form['email']
            passwordregister = request.form['passwordreg']
            passwordconf = request.form['confpass']
            if passwordregister == passwordconf:
                add_user(conn, usernameregister, passwordregister, emailregister)
                print("#########USER CREATED#############")
            else:
                flash('Password and password confirmation must match')
                print("IKKE LIKT PASSORD I BEGGE LINJER")
    #Funksjoner i "/" route
    if currwind == '/':
        print("Dette er /")
        if request.method == 'POST':
            print("DAAAAAAAAAAAAAAAAMN")
            username = request.form['username']
            password = request.form['password']
    return app.send_static_file("home.html")

@app.route("/#register", methods=['POST', 'GET'])
def register():
    conn = get_db()
    print("NÅ ER DEN PÅ DEN ANDRE REGISTRERINGEN")
    currwind = request.url_rule
    
    if request.method == 'POST':
        print("DEN REGISTRERER")
        usernameregister = request.form['username']
        emailregister = request.form['email']
        passwordregister = request.form['passwordreg']
        passwordconf = request.form['confpass']
        if passwordregister == passwordconf:
            add_user(conn, usernameregister, passwordregister, emailregister)
            print("#########USER CREATED#############")
        else:
            flash('Password and password confirmation must match')
            print("IKKE LIKT PASSORD I BEGGE LINJER")





if __name__ == '__main__':
    app.run(debug=True)
