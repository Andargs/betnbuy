import sqlite3
from sqlite3 import Error
from collections import Counter

database = r"./database.db"


def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        return conn
    except Error as e:
        print(e)

    return conn

sql_create_user_table = """CREATE TABLE IF NOT EXISTS users (
                                username TEXT PRIMARY KEY,
                                password TEXT,
                                email TEXT,
                                tickets INTEGER,
                                products ID PRIMARYKEY
                            );"""

sql_create_product_table = """CREATE TABLE IF NOT EXISTS products (
                                id INTEGER PRIMARY KEY,
                                description TEXT,
                                tickets INTEGER,
                                mincost INTEGER,
                                owner TEXT PRIMARY KEY,
                                Spenders TEXT,
                                Foreign key(id,owner)
                            );"""

def create_table(conn, create_table_sql):
    """ create a table from the create_table_sql statement
    :param conn: Connection object
    :param create_table_sql: a CREATE TABLE statement
    :return:
    """
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def add_user(conn, username,password,email):
    """
    Add a new user into the students table
    :param conn:
    :param username:
    :param password:
    :param email:
    :param tickets
    :param products
    """
    sql = ''' INSERT INTO users(username,password,email,1000,null)
              VALUES(?,?,?,1000,null) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (username, password, email))
        conn.commit()
    except Error as e:
        print(e)


def add_product(conn, id,description,tickets, mincost, owner, spenders):
    """
    Add a new student into the students table
    :param conn:
    :param id:
    :param description:
    :param tickets:
    :param mincost:
    :param owner
    :param spenders
    """
    sql = ''' INSERT INTO users(id,description,tickets,mincost,owner, spenders)
              VALUES(?,?,?,?,?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (id, description, tickets, mincost, owner, spenders))
        conn.commit()
    except Error as e:
        print(e)