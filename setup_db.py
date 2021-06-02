import sqlite3
from sqlite3 import Error
import random

database = r"./database.db"

#####Establishes a db connection#########
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


###Base setup with the tables##########
#username: A username for the user to uniquely identify them
#The users password to enable login
#An email for each user, for a real site this would be used for verification
sql_create_user1_table = """CREATE TABLE IF NOT EXISTS users1 (
                                username TEXT PRIMARY KEY,
                                password TEXT,
                                email TEXT
                            );"""

#Creates a product table
#Id, uniqeuly id's every product, and increments on each product added to the database
#Name, a name for each product, not unique due to products names might be similar
#img blob - After much trial and error, this was not needed in the database when i managed to get the images in
# ,but removing it caused a lot of bugs, so i reverted and kept it in due to time pressure
#description, a description for the product
#tickets, how many tickets the different users have spent on the specific product
#mincost, minimum cost that allowes a product to be sold
#owner, which user owns the product
#spenders: A text with every user that has spent tickets on the specific product, inserted x amount of times as the tickets they have bought
#filters which makes it possible to sort products based on genre
#date, which date the product will be sold on
#status: Tells if the product is done(date is reahed) or not done yet(date not reached)
#Winner: If a winner is choosen, the winner will be added to the database to make sure no more than one winner is selected
sql_create_products7_table = """CREATE TABLE IF NOT EXISTS products7 (
                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                name TEXT NOT NULL,
                                img BLOB NOT NULL,
                                description TEXT,
                                tickets INTEGER,
                                mincost INTEGER NOT NULL,
                                owner TEXT NOT NULL,
                                Spenders TEXT,
                                filters text,
                                date text,
                                status int,
                                winner text
                            );"""

#username: username which owns the tickets
#Tickets: how many tickets the user has
sql_create_usertickets_table = """CREATE TABLE IF NOT EXISTS usertickets (
                                username text,
                                tickets integer
                                );"""

############END OF BASE SETUP###############



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

#Adds a user to the database
def add_user(conn, username,password,email):
    """
    Add a new user into the students table
    :param conn:
    :param username:
    :param password:
    :param email:
    """
    sql = ''' INSERT INTO users1(username,password,email)
              VALUES(?,?,?) '''
    
    sql2 = ''' INSERT INTO usertickets(username,tickets)
                VALUES(?,1000)'''
    try:
        cur = conn.cursor()
        cur.execute(sql, (username, password, email,))
        cur.execute(sql2, (username,))
        conn.commit()
        return "User created"
    except Error as e:
        print(e)
        return -1

#Checks the password against the database
def passwordcheck(conn, username):
    cur = conn.cursor()
    sql = ("SELECT username,password FROM users1 WHERE username = ?") 
    cur.execute(sql, (username,))
    user = []
    for element in cur:
        user.append(element)

    return user

#Retrieves the user
def get_user(conn, username):
    cur = conn.cursor()
    sql = ("SELECT username,products FROM users1 WHERE username = ?")
    cur.execute(sql, (username,))
    user = []
    for element in cur:
        user.append(element)
    return user


#Get the users tickets to make sure updating happens on reload
def get_user_tickets(conn, username):
    cur = conn.cursor()
    sql = ("SELECT tickets FROM usertickets WHERE username = ?")
    cur.execute(sql, (username,))
    tickets = []
    for element in cur:
        tickets.append(element)
    return tickets


#Return all products to the main page
def get_all_products(conn):
    sql1 = ''' Select id FROM products7;'''
    cur = conn.cursor()
    cur.execute(sql1,)
    products= []
    for id in cur:
        id = int(id[0])
    for i in range(id+1):
        sql = f''' Select id,name,img,description,tickets,mincost,date FROM products7 WHERE id = {i} ;'''
        cur = conn.cursor()
        cur.execute(sql,)
        for product in cur:
            products.append(product)
    return products

#Add a product to the database
def add_product(conn, name, img,description, mincost, owner,date, filters):
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
    sql = ''' INSERT INTO products7(name,img,description,mincost,owner,date, filters, status)
              VALUES(?,?,?,?,?,?,?,0) '''
    try:
        cur = conn.cursor()
        cur.execute(sql, (name, img, description, mincost, owner,date,filters,))
        conn.commit()
    except Error as e:
        print(e)


#Gets the new soon to be product id, and retrieves it for processing to make sure each product gets their respective image
def get_id(conn):
    cur = conn.cursor()
    try:
        sql = 'SELECT MAX(id) FROM products7'
        cur.execute(sql,)
        for element in cur:
            return element[0]
    except Error as e:
        print(e)

##################SPEND TICKETS ON PRODUCTS####################

def spend_tickets(conn,user,prodid,tickets):
    #Extracts the current ticket value
    curhenttickets = conn.cursor()
    status = confirmstatus(conn, prodid)
    if int(status) == 1:
        return "Sold"
    try:
        sqlhenttickets = ''' SELECT tickets FROM products7 WHERE id = ? '''
        curhenttickets.execute(sqlhenttickets, (prodid,))
        currenttickets = []
        currenttickets1 = 0
        for elements in curhenttickets:
            currenttickets.append(elements)
        if currenttickets[0][0] == None or currenttickets[0][0] == "null":
            currenttickets1 = 0
            currenttickets1 += int(tickets)
        else:
            currenttickets1 = currenttickets[0][0]
            currenttickets1 = int(currenttickets1)
            currenttickets1 += int(tickets)
            currenttickets1 = str(currenttickets1)
    except Error as e:
        print(e)
    #Sets the current ticket amount on the product to previous value + what the user spent
    cur = conn.cursor()
    try:
        sql = ''' UPDATE products7 SET tickets = ? WHERE id = ? LIMIT 1  '''
        cur.execute(sql, (currenttickets1,prodid,))
        conn.commit()
    except Error as e:
        print(e)

    #Finds the current users who spent money on the product
    curfindspenders = conn.cursor()
    try:
        sqlfindspenders = ''' SELECT spenders FROM products7 WHERE id = ? '''
        curfindspenders.execute(sqlfindspenders, (prodid,))
        currentspenders = []
        currentspenders1 = ""
        for element in curfindspenders:
            currentspenders.append(element)
        currentspenders1 = f"{currentspenders[0][0]}"
        for i in range(tickets):
            currentspenders1 += f",{user}"
    except Error as e:
        print(e)
    #Inserts the user who spent tickets into the database to make sure the user will be accounted for when choosing winner
    cur1 = conn.cursor()
    try:
        sql1 = ''' UPDATE products7 SET spenders = ? where id = ? LIMIT 1'''
        cur1.execute(sql1, (currentspenders1, prodid, ))
        conn.commit()
    except Error as e:
        print(e)
    #Remove the amount of tickets spent by user, from the users profile
    currsubtracttickets = conn.cursor()
    try:
        sqlsubtracttickets = ''' SELECT tickets FROM usertickets WHERE username = ? '''
        currsubtracttickets.execute(sqlsubtracttickets, (user,))
        usertickets = []
        usertickets1 = 0
        for element in currsubtracttickets:
            usertickets.append(element)
        if usertickets[0][0] == None:
            usertickets1 = 1000
            usertickets1 -= int(tickets)
            usertickets1 = str(usertickets1)
        else:
            usertickets1 = usertickets[0][0]
            usertickets1 = int(usertickets1)
            usertickets1 -= int(tickets)
            usertickets1 = str(usertickets1)
    except Error as e:
        print(e)
    #updates the users profile to remove the tickets the just spent on the product
    cur2 = conn.cursor()
    try:
        sql2 = ''' Update usertickets SET tickets = ? WHERE username = ? LIMIT 1 '''
        cur2.execute(sql2, (usertickets1, user, ))
        conn.commit()
    except Error as e:
        print(e)

###############DELETE PRODUCT#################

def delete_prod(conn, user, prodid):
    cur = conn.cursor()
    status = confirmstatus(conn, prodid)
    if int(status) == 1:
        return "Sold"
    try:
        sql = ''' SELECT owner FROM products7 WHERE id = ? ''' #Checks if the user who wants to delete a product is the owner of the product
        cur.execute(sql, (prodid, ))
        productowner = []
        for element in cur:
            productowner.append(element)
    except Error as e:
        print(e)
    if f"{productowner[0][0]}" == f"{user}":       #If the owner is the one who deletes it, the product will be deleted
        returntickets_ondelete(conn,prodid)
        cur1 = conn.cursor()
        try:
            sql1 = ''' DELETE FROM products7 WHERE id = ?'''
            cur1.execute(sql1, (prodid,))
            conn.commit()
            return "Right"
        except Error as e:
            print(e)
    else:
        return "Wrong" #If the owner is not the one who tries to delete, the product will not be deleted


##########RETURN TICKETS ON DELETE, OR IF PRODUCT DOESNT HAVE THE NECESSARY TICKETS TO PERFORM SALE##################

def returntickets_ondelete(conn, prodid):
    cur = conn.cursor()
    try:
        sql = 'SELECT Spenders FROM products7 WHERE id = ?' #Retrieves the users who spent money on the product
        cur.execute(sql, (prodid,))
        spenders = []
        for element in cur:
            spenders.append(element[0])
        spenders = spenders[0]
        spenders = str(spenders)
        spenders = spenders.split(",")
    except Error as e:
        print(e)
    cur1 = conn.cursor()
    try:
        current_ticket_count = 0
        sql1 = 'SELECT tickets FROM usertickets WHERE username = ?' #Retrieves the current amount of money each user has
        for i in range(len(spenders)-1):
            if spenders[i] != None:
                cur1.execute(sql1, (str(spenders[i+1]),))
            else:
                spenders[i] = spenders[i+1]
            ticket = []
            for elements in cur1:
                ticket.append(elements)
            current_ticket_count = int(ticket[0][0])
            current_ticket_count += 1
            cur2 = conn.cursor()
            try:
                sql2 = 'UPDATE usertickets SET tickets = ? WHERE username = ? LIMIT 1'  #Gives each user back the tickets they used on the product
                cur2.execute(sql2, (current_ticket_count,spenders[i+1],))
                conn.commit()
            except Error as e:
                print(e)
    except Error as e:
        print(e)

#############PICK WINNER FOR PRODUCT#############

def pick_winner(conn,id,tickets,mincost):
    status = confirmstatus(conn, id)
    try:
        if int(status) == 1:
            winner = get_winner(conn, id)
            return winner
    except TypeError as e:
        print(e)
    cur = conn.cursor()
    try:
        updatestatus(conn,id)
        sql = 'SELECT owner FROM products7 WHERE id = ?'  #Retrieves the owner of the product
        cur.execute(sql, (id,))
        tickets1 = []
        for element in cur:
            tickets1.append(element)
        if tickets == None or tickets == "null":  #Checks if the product has gotten buyers
            returntickets_ondelete(conn,id)
            winner = "No winner choosen, tickets will be returned to spenders"
            update_winner(conn, id, winner)
            return "null"
        elif int(tickets) < int(mincost):        #Checks if the product has gotten enough tickets to be sold
            winner = "No winner choosen, tickets will be returned to spenders"
            update_winner(conn, id, winner)
            returntickets_ondelete(conn,id)
            return "null"
        else:                   #If none of the if statements stops it, the product is approved for picking a winner
            cur2 = conn.cursor()
            sql2 = 'SELECT tickets FROM usertickets WHERE username = ?'            #Retrieves the owners ticketcount
            cur2.execute(sql2, (tickets1[0][0],))
            usertickets = []
            for element in cur2:
                usertickets.append(element)
            newticketcount = usertickets[0][0]
            newticketcount = int(newticketcount)
            newticketcount += int(tickets)
            try:
                cur3 = conn.cursor()
                sql3 = 'UPDATE usertickets SET tickets = ? WHERE username = ? LIMIT 1'        #adds the tickets spent on their product to their balance
                cur3.execute(sql3, (newticketcount,tickets1[0][0],))
                conn.commit()
                answer = pick_winner_name(conn, id)         #Picks a winner by getting a name out of the specified products spenders attribute
                return answer
            except Error as e:
                print(e)
    except Error as e:
        print(e)


#Picks a winner and sets it to the database
def pick_winner_name(conn, id):
    cur = conn.cursor()
    try:
        sql = 'SELECT spenders FROM products7 WHERE id = ?'    #If the product is approved for sale, it will now choose a winner
        cur.execute(sql, (id,))
        spenders = []
        for element in cur:
            spenders.append(element)
        spenders = spenders[0]
        spenders = str(spenders)
        spenders = spenders.split(",")
        winner = spenders[random.randint(1,len(spenders)-1)]      #The winner is picked at random
        update_winner(conn, id, winner)    #sets winner in the database
        updatestatus(conn, id)      #Updates the status to make sure it doesnt choose winner again
        return winner        #Returns a winner which will be showed on the product
    except Error as e:
        print(e)


##############FILTER PRODUCTS################
#Filter will always take one input, meaning that even though a user filters based on nothing, it will pass " " as the search value,
#The function will therefore give out every product in the database.
#If more filters are choosen, the database will insert x elements in the database to see what is choosen
def filter_product(conn, list):
    length = len(list[0])
    productsfilter = []
    if length == 1 and list[0][0] == " ":
        cur = conn.cursor()
        try:
            sql = 'SELECT id,name,img,description,tickets,mincost,date FROM products7 WHERE id >= 0'
            cur.execute(sql, )
            for element in cur:
                productsfilter.append(element)
            return productsfilter
        except Error as e:
            print(e)
    if length == 1:       #If the length of input is one element and the input is different than " "
        cur = conn.cursor()
        try:
            sql = 'SELECT id,name,img,description,tickets,mincost,date FROM products7 WHERE instr(name, ?)'
            cur.execute(sql,(list[0][0],))
            for element in cur:
                productsfilter.append(element)
            return productsfilter
        except Error as e:
            print(e)
    if length == 2:       #If the length of input is two elements
        cur = conn.cursor()
        try:
            sql = 'SELECT id,name,img,description,tickets,mincost,date FROM products7 WHERE instr(name, ?) > 0 AND instr(filters, ?) > 0;'
            cur.execute(sql,(str(list[0][0]),str(list[0][1]),))
            for element in cur:
                productsfilter.append(element)
            return productsfilter
        except Error as e:
            print(e)
    if length == 3:        #If the length of input is three elements
        cur = conn.cursor()
        try:
            sql = 'SELECT id,name,img,description,tickets,mincost,date FROM products7 WHERE instr(name, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0'
            cur.execute(sql,(list[0][0],list[0][1],list[0][2],))
            for element in cur:
                productsfilter.append(element)
            return productsfilter
        except Error as e:
            print(e)
    if length == 4:         #If the length of input is four elements
        cur = conn.cursor()
        try:
            sql = 'SELECT id,name,img,description,tickets,mincost,date FROM products7 WHERE instr(name, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0'
            cur.execute(sql,(list[0][0],list[0][1], list[0][2], list[0][3], ))
            for element in cur:
                productsfilter.append(element)
            return productsfilter
        except Error as e:
            print(e)
    if length == 5:             #If the length of input is five elements
        cur = conn.cursor()
        try:
            sql = 'SELECT id,name,img,description,tickets,mincost,date FROM products7 WHERE instr(name, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0'
            cur.execute(sql,(list[0][0],list[0][1], list[0][2], list[0][3],list[0][4], ))
            for element in cur:
                productsfilter.append(element)
            return productsfilter
        except Error as e:
            print(e)
    if length == 6:             #If the length of input is six elements
        cur = conn.cursor()
        try:
            sql = 'SELECT id,name,img,description,tickets,mincost,date FROM products7 WHERE instr(name, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0 AND instr(filters, ?) > 0'
            cur.execute(sql,(list[0][0],list[0][1], list[0][2], list[0][3],list[0][4],list[0][5], ))
            for element in cur:
                productsfilter.append(element)
            return productsfilter
        except Error as e:
            print(e)


#Checks if a winner is choosen previously
def confirmstatus(conn, id):
    cur = conn.cursor()
    try:
        sql = 'Select status FROM products7 WHERE id = ?'
        cur.execute(sql, (id, ))
        for element in cur:
            return element[0]
    except Error as e:
        print(e)

#Updates the status of the product if a winner is already choosen
def updatestatus(conn, id):
    cur = conn.cursor()
    try:
        sql = 'UPDATE products7 SET status = 1 WHERE id = ? LIMIT 1'
        cur.execute(sql, (id,))
        conn.commit()
    except Error as e:
        print(e)

#Updates the winner if a winner is choosen
def update_winner(conn, id, winner):
    cur = conn.cursor()
    try:
        sql = 'UPDATE products7 SET winner = ? WHERE id = ? LIMIT 1'
        cur.execute(sql, (winner,id,))
        conn.commit()
    except Error as e:
        print(e)

#Gets the winner of a specific product and returns it
def get_winner(conn, id):
    cur = conn.cursor()
    try:
        sql = 'Select winner FROM products7 WHERE id = ?'
        cur.execute(sql, (id,))
        for element in cur:
            return element[0]
    except Error as e:
        print(e)

####################BASE SETUP######################


def setup():
    conn = create_connection(database)
    if conn is not None:
        create_table(conn, sql_create_products7_table)
        create_table(conn, sql_create_user1_table)
        create_table(conn, sql_create_usertickets_table)
        conn.close()


if __name__ == '__main__':
    setup()

    #################FIX PRODUCTS 5 DB##################