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

sql_create_products2_table = """CREATE TABLE IF NOT EXISTS products2 (
                                id INTEGER,
                                name TEXT NOT NULL,
                                img BLOB NOT NULL,
                                description TEXT,
                                tickets INTEGER,
                                mincost INTEGER NOT NULL,
                                owner TEXT NOT NULL,
                                Spenders TEXT
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
    :param tickets:
    :param products:
    """
    sql = ''' INSERT INTO users(username,password,email,tickets,products)
              VALUES(?,?,?,1000,null) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (username, password, email))
        conn.commit()
        return "User created"
    except Error as e:
        print(e)
        return -1


def passwordcheck(conn, username):
    cur = conn.cursor()
    sql = ("SELECT username,password FROM users WHERE username = ?") 
    cur.execute(sql, (username,))
    user = []
    for element in cur:
        user.append(element)

    return user

def get_user(conn, username):
    cur = conn.cursor()
    sql = ("SELECT username,tickets,products FROM users WHERE username = ?")
    cur.execute(sql, (username,))
    user = []
    for element in cur:
        user.append(element)
    return user


def add_product(conn, id,name, img,description,tickets, mincost, owner, spenders):
    """
    Add a new student into the products table
    :param conn:
    :param id:
    :param name:
    :param img:
    :param description:
    :param tickets:
    :param mincost:
    :param owner:
    :param spenders:
    """
    sql = ''' INSERT INTO products1(id,name,img,description,tickets,mincost,owner, spenders)
              VALUES(?,?,?,?,0,?,?,?) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (id,name, img, description, mincost, owner, spenders))
        conn.commit()
    except Error as e:
        print(e)




####################BASE SETUP######################

def setup():
    conn = create_connection(database)
    if conn is not None:
        create_table(conn, sql_create_products2_table)
        create_table(conn, sql_create_user_table)
        conn.close()


if __name__ == '__main__':
    setup()