from flask import Flask, jsonify, render_template, g
from flask_sqlalchemy import SQLAlchemy
import sqlite3
from datetime import datetime

app = Flask(__name__)
app.config.from_object(__name__)

DATABASE = './database.db'


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.route("/")
def home():
    return app.send_static_file("home.html")

@app.route("/register")
def registrering():
    return app.send_static_file("registrering.html")


if __name__ == '__main__':
    app.run(debug=True)
