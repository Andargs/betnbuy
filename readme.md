Git repository: https://github.com/Andargs/betnbuy.git

Site uses jquery and ajax, but jquery is only used for a few tasks.
Site also uses python add ons: PIL(pillow) and IObytes to handle images


To run the app be in the root of eksamen folder, and run: python3 app.py
The database should already be created with some base products


All functionality is based on input in js, the input is retrieved by the backend app.py which processes the data, if needed, the app.py script will call upon functions from setup_db.py, which communicates with the database

-Main functionality of page
    -The page functions mainly like a auctioning site, except in this case, the winner is selected randomly among the people who spent a ticket on the product. Even though a user pays the full minimum cost, they are not sure they will win the product. If the product doesnt reach the minimum cost selected by the creator of the product, the product will not be sold, and all tickets will be returned to the users who spent money on tickets for the product.
    Every ticket spent will increase the users chance of winning the product. Due to the winner being choosen by time, this allowes for the product to go way over what the minimumcost for sale was set as, making it a viable option for selling whatever you may want.

-Login page
    -The user will write their username and password which will be checked against the backend
    -Link to the registration site

-Register page
    -Allowes the users to register themselves
    -The logo in the top left corner will return the user to the login page
    -Creating a user will automatically route the user to the login page
    -If the registration fails, the user will get a pop up box explaining the error, and lets the user try again

-home page
    -After the user has logged in, their userdata will be stored inn currentuserdata, this will hold their username and currentticketcount, this makes updating their tickets easier and makes it easier to regularly send their data to the frontend for them to see.
    -logo in the top left corner will return the user to the login page
    -Filter
        -Filtering allowes the user to filter based upon the name of the product, and what genre they fit in
        -Beneath the filter options, there are 2 options for sorting, there the user can either sort the products by highest ticketcount spent, or alphabetically, not both at the same time
        -Both filter and sort are enabled by pressing the filter button
        -Some products i added were added without a filter, just to show that a product doesnt automatically get a genre.
        -Due to the way a plain js router is set up and how it communicates with the backend, the simplest way to store the users filter preferences seemed to be a global value. Filter values will be stored, sorting values will not
        -If no product fits the description, the page will be blank. To get products back, filter by another metric
    -products
        -Every product has its own delete button which will delete the product
            -On delete all the tickets spent on the product will be returned to the users who spent money on it
            -No tickets will be awarded to the creator unless they spent money on their own product
        -Choose a winner
            -If the timer for each product reaches 0, some product attributes will be checked
                -If the winner is already choosen(status=1), the winner will be selected from the table and inserted
                -If the amount of tickets spent < minimum cost, the tickets spent will be returned to the users who spent tickets on it, and no winner will be choosen.
                -if none of these checks fails, it will choose a winner
                    -Opens a list of all users who spent money on the product, and chooses a random winner among them
                    -Winner will be added to the table, and status for the product will be changed from 0 to 1, and the winner will recieve all tickets spent on the product
                    -The winner will then be added to the product section of the home page, showing which user won to all users
        -spend tickets
            -If the user doesnt have enough tickets, an error will be returned
            -if the user tries to use a negative sum, an error will be returned
            -If none of these checks fail, the product will get the tickets spent added to its ticketcount, and the user who spent them will be added x(how many tickets they spent) times to the spenders attribute of the table.
        -icons in the top right
            -The shopping cart will give the users the ability to create their own product on the products page
            -Clicking the user logo will change display and show the user what their username is, along with their current ticketcount
            -The home logo will return the user to the main page(#home) where the new product will be shown
            -The userlogo with an x will logout the user, but first ask if they want to be logged out.

-Products
    -Allowes the user to create a product
    -The data the users add will be shown on the #home page after a succsessfull commit
    -The user will be rerouted to #home after a succsessfull commit
    -Icons in the top right
        -The shopping cart will give the users the ability to create their own product on the products page
        -Clicking the user logo will change display and show the user what their username is, along with their current ticketcount
        -The home logo will return the user to the main page(#home) where the new product will be shown
        -The userlogo with an x will logout the user, but first ask if they want to be logged out.