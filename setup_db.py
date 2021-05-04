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

sql_create_user1_table = """CREATE TABLE IF NOT EXISTS users1 (
                                username TEXT PRIMARY KEY,
                                password TEXT,
                                email TEXT,
                                products ID PRIMARYKEY
                            );"""

sql_create_products4_table = """CREATE TABLE IF NOT EXISTS products4 (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                name TEXT NOT NULL,
                                img BLOB NOT NULL,
                                description TEXT,
                                tickets INTEGER,
                                mincost INTEGER NOT NULL,
                                owner TEXT NOT NULL,
                                Spenders TEXT,
                                filters text
                            );"""

sql_create_usertickets_table = """CREATE TABLE IF NOT EXISTS usertickets (
                                username text,
                                tickets integer
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
    :param products:
    """
    sql = ''' INSERT INTO users1(username,password,email,products)
              VALUES(?,?,?,null) '''
    
    sql2 = ''' INSERT INTO usertickets(username,tickets)
                VALUES(?,1000)'''
    try:
        cur = conn.cursor()
        cur.execute(sql, (username, password, email,))
        print("Bruker lagd")
        cur.execute(sql2, (username,))
        print("Bruker tickets lagd")
        conn.commit()
        return "User created"
    except Error as e:
        print(e)
        return -1


def passwordcheck(conn, username):
    cur = conn.cursor()
    sql = ("SELECT username,password FROM users1 WHERE username = ?") 
    cur.execute(sql, (username,))
    user = []
    for element in cur:
        user.append(element)

    return user

def get_user(conn, username):
    cur = conn.cursor()
    sql = ("SELECT username,products FROM users1 WHERE username = ?")
    cur.execute(sql, (username,))
    user = []
    for element in cur:
        user.append(element)
    return user

def get_user_tickets(conn, username):
    cur = conn.cursor()
    sql = ("SELECT tickets FROM usertickets WHERE username = ?")
    cur.execute(sql, (username,))
    tickets = []
    for element in cur:
        tickets.append(element)
    return tickets


def add_product(conn, name, img,description,tickets, mincost, owner, spenders, filters):
    """
    Add a new product into the products table
    :param conn:
    :param id:
    :param name:
    :param img:
    :param description:
    :param tickets:
    :param mincost:
    :param owner:
    :param spenders:
    :param filters:
    """
    sql = ''' INSERT INTO products4(name,img,description,tickets,mincost,owner, spenders, filters)
              VALUES(?,?,?,0,?,?,?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (name, img, description, mincost, owner, spenders,filters,))
        conn.commit()
    except Error as e:
        print(e)




####################BASE SETUP######################

def setup():
    conn = create_connection(database)
    if conn is not None:
        create_table(conn, sql_create_products4_table)
        create_table(conn, sql_create_user1_table)
        create_table(conn, sql_create_usertickets_table)
        conn.close()


if __name__ == '__main__':
    setup()