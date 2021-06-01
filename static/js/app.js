

//Main routing device
//Each route is set up as a case where the hash decides what will be shown in the html, and which functions will be run
async function onRouteChanged() {
    //Konstanter som henter deler av html siden hvor data skal settes inn for bruk.
    const hash = window.location.hash;
    const app = document.getElementById('app');
    const links = document.getElementById('links')
    const main = document.getElementById("main")
    const productcreation = document.getElementById('productcreation')


    if (!(app instanceof HTMLElement)) {
        throw new ReferenceError('No path element made')
    }
    switch (hash) {
        case '':
        case '/': {
            //////////////HTML////////////////////
            //Setter opp skjema for login
            app.innerHTML = '<h1><a href=""></a><i class="fa fa-user-circle" style="font-size: 3em"></i></h1>'
            +'<h1 id="overskrift"> Login </h1>'
            +'<br>'
            +'<br>'
            +'<form action="/" method="POST">'
            +'<input type="text" placeholder="Username" id="username" name="username" required>'
            +'<br>'
            +'<br>'
            +'<input type="password" placeholder="Password" id="password" name="password" required>'
            +'<br>'
            +'<br>'
            +'<input type="submit" value="Login" id="submit">'
            +'<br>'
            +'<a href="#register" id="refern">Register user</a>'
            +'</form>';

            /////////////FUNCTIONS///////////

            //Sender data til backend for login
            $(document).ready(function() {
                $('form').on('submit', function(event) {
                    $.ajax({
                        data: {
                            name: $('#username').val(),
                            password: $('#password').val()
                        },
                        type: "POST",
                        url: "/"
                    })
                    .done(function(data){
                        if (data == "No user by that name"){
                            alert(data)
                            return window.location.reload()
                        }
                        if (data == "Wrong password") {
                            alert(data)
                            return window.location.reload()
                        }
                        else {
                            return window.location.hash = '#home'
                        }
                    });
                    event.preventDefault()
                });
            });
                        
            break;
        }

        case '#register': {
            
            links.innerHTML = "";
            ////////////////////HTML////////////////////////
            //Setter inn skjema så brukeren kan opprette bruker
            app.innerHTML = '<h1><a href=""></a><i class="fa fa-user-plus" style="font-size: 3em"></i></h1>'
            +'<h1 id="overskriftreg"> Register User </h1>'
            +'<br>'
            +'<br>'
            +'<form action="#register" method="POST">'
            +'<input type="text" placeholder="Username" id="usernamereg" name="usernamereg" required>'
            +'<br>'
            +'<br>'
            +'<input type="text" placeholder="Email" id="email" name="email" required>'
            +'<br>'
            +'<br>'
            +'<input type="password" placeholder="Password" id="passwordreg" name="passwordreg" required>'
            +'<br>'
            +'<br>'
            +'<input type="password" placeholder="Confirm Password" id="confpass" name="confpass" required>'
            +'<input type="submit" value="Register" id="register">'
            +'</form>';
            
            //////////////////////FUNCTIONS//////////////////////
            //Gjør at brukeren kan opprette bruker og sender data til backend så registrering kan gjennomføres
            $(document).ready(function() {
                $('form').on('submit', function(event) {
                    $.ajax({
                        data: {
                            name: $('#usernamereg').val(),
                            email: $('#email').val(),
                            password: $('#passwordreg').val(),
                            passwordconf: $('#confpass').val()
                        },
                        type: "POST",
                        url: "/register"
                    })
                    .done(function(data){
                        if (data == 'User created'){
                            return window.location.hash = '#'
                        }
                        return alert(data)
                    });
                    event.preventDefault()
                });
            });
            
            break;
        }
        

        case '#home': {
            ////////////////////////HTML///////////////////////
            //Enables navigation
            links.innerHTML = '<nav>'
            +'<ul>'
                +'<li ><i id="logout" class="fa fa-user-times"></i></li>'
                +'<li><a href="#home"><i class="fa fa-home"></i></a></li>'
                +'<li ><i id="userlogo" class="fa fa-user"></i></li>'
                +'<li><a href="#products"><i class="fa fa-shopping-cart"></i></a></li>'
            +'</ul>'
            +'</nav>';
            
            //Fyller inn siden med filtrering og produkter
            main.innerHTML = '<section id="filter">'
            +'<h3>Filter Search</h3>'
            +`<input type="text" placeholder="Search..." name="searchbar"  id="searchbar" id="searchbar"><br>`
            +'<br>'
            +'<br>'
            +`<label for="house" class="checkboxes">Housing<input type="checkbox" id="house" name="house" value="house" class="checkboxes"/>`
              +'</label>'
              +'<br>'
              +'<br>'
              +`<label for="vehicle" class="checkboxes">Vehicle<input type="checkbox" id="vehicle" name="vehicle" value="vehicle" class="checkboxes"/>`
              +'</label>'
              +'<br>'
              +'<br>'
              +`<label for="travel" class="checkboxes">Travel<input type="checkbox" id="travel" name="travel" value="travel" class="checkboxes"/>`
              +'</label>'
              +'<br>'
              +'<br>'
              +`<label for="furniture" class="checkboxes">Furniture<input type="checkbox" id="furniture" name="furniture" value="furniture" class="checkboxes"/>`
              +'</label>'
              +'<br>'
              +'<br>'
              +`<label for="other" class="checkboxes">Other<input type="checkbox" id="other" name="other" value="other" class="checkboxes"/>`
              +'</label>'
              +`<br>`
              +`<br>`
              +`<h3>Sort by</h3>`
              +`<label for="Alphabetically" class="checkboxes">Alphabetically<input type="checkbox" id="Alphabetically" name="Alphabetically" value="Alphabetically" class="checkboxes"/>`
              +'</label>'
              +`<br>`
              +`<br>`
              +`<label for="Ticket-Value" class="checkboxes">Ticket Value<input type="checkbox" id="Ticket-Value" name="Ticket-Value" value="Ticket-Value" class="checkboxes"/>`
              +'</label>'
              +`<button id="filterbutton" onclick="filter('searchbar', '#house:checked', '#vehicle:checked', '#travel:checked', '#furniture:checked', '#other:checked', '#Alphabetically:checked','#Ticket-Value:checked')">Filter</button>`
            +'</section>'
            +'<section id="products">'
            +'</section>'
            +'<div id="userinfo" style="display: none;">'
                +'<ul>'
                    +'<li><h3 id=currentusername>User: </h3></li>'
                    +'<li><h3 id=currentusertickets>Tickets: </h3></li>'
                +'</ul>'
            +'</div>';

            /////////Empties other html divs which are not used on routechange on the new page//////////
            app.innerHTML = "";

            productcreation.innerHTML = "";

            ///////////////////EVENT LISTENERS/////////////////
            // Add eventlisteners to run functions properly
            document.getElementById('filterbutton').addEventListener('filterbutton', onclick)
            document.getElementById('userlogo').addEventListener('click',showuser)
            document.getElementById('logout').addEventListener('click', logoutconfirmation)
            document.getElementById('filterbutton').addEventListener('click',filter)

            //////////////////FUNCTIONS////////////////////
            //Checks that the user is actually validated, and gives the user information about its profile
            $.ajax({
                data: {
                },
                type: "POST",
                url: "/home"
            })
            .done(function(data){
                if (data.length != 2) {
                    window.location.hash = '#'
                    window.location.reload()
                }
                showproducts(data)
                //Adds retrievable information the user can look at
                document.getElementById('currentusername').innerHTML += `${data[0][0]}`
                document.getElementById('currentusertickets').innerHTML += `${data[0][1]}`
                if (data === "\"Redirect\""){
                    window.location.hash = '#'
                    window.location.reload()
                }
                
            });

            //Hides and shows the users info on click
            function showuser() {
                var user = document.getElementById('userinfo');
                if (user.style.display === "none") {
                    user.style.display = "block";
                } else {
                    user.style.display = "none";
                }
            }


            // Shows the products on load
            function showproducts(data){
                products = document.getElementById('products')
                for (i=0; i<data[1].length;i++){
                    //Calculates the time until a winner is choosen
                    function startcountdown(date){
                        var countdown = new Date(date[1][i][6]).getTime()
                        var currentdate = new Date().getTime();
                        var distance = countdown - currentdate;
                        var days = Math.floor(distance/(1000*60*60*24))
                        var hours = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
                        var minutes = Math.floor((distance%(1000*60*60))/(1000*60));
                        var seconds = Math.floor((distance%(1000*60))/1000);
                        if (distance <= 0){
                            days = 0
                            hours = 0
                            minutes = 0
                            seconds = 0
                            choose_winner(data[1][i][0],data[1][i][4],data[1][i][5])
                        }
                        list = []
                        list.push(days,hours,minutes,seconds)
                        return list

                    }
                    //////////////Adds products in the html
                    image = localStorage.getItem("HER TRENGER JEG produktid")
                    countdown = startcountdown(data)
                    //Adds product in html
                    products.innerHTML += `<div id="${data[1][i][0].toString()}" style=" border:solid; border-width:2px; border-color:#9932cc;">`
                    +`<section id="sideomside">`
                    +`<h1 style="display:inline-block;" id="${data[1][i][0].toString()}winner">${data[1][i][1]}</h1><button type="button" id="delete" onclick="delete_product(${data[1][i][0]})" style="display:inline-block;">DELETE</button>` 
                    +`</section>`
                    +`<img id="${data[1][i][0].toString()}img" src="./static/images/${data[1][i][0].toString()}img.png"/>`
                    +`<br>`
                    +`<p>${data[1][i][3]}</p>`
                    +`<h3 style="display:inline-block;">${data[1][i][4]}/${data[1][i][5]} tickets spent</h3>          <h3 style="display:inline-block; margin-left:25%" >Time left: ${countdown[0]} days:${countdown[1]} hours:${countdown[2]} minutes:${countdown[3]} seconds</h3>`
                    +`<br><br>`
                    +`<input type="number" placeholder="How many tickets to use" id="${data[1][i][0].toString()}sum"><button type="button" id="submittickets" onclick="pay_for_prod(${data[1][i][0]},'${data[1][i][0].toString()}sum')">Submit</button> <br><br>`
                    +`</div>`
                    +`<br><br>`
                }
            }; 
            break;
        }

        case '#products':  {
            //////////////////HTML/////////////////
            // Setter opp navigeringen for brukeren
            links.innerHTML = '<nav>'
            +'<ul>'
                +'<li ><i id="logout" class="fa fa-user-times"></i></li>'
                +'<li><a href="#home"><i class="fa fa-home"></i></a></li>'
                +'<li ><i id="userlogo" class="fa fa-user"></i></li>'
                +'<li><a href="#products"><i class="fa fa-shopping-cart"></i></a></li>'
            +'</ul>'
            +'</nav>';

            main.innerHTML = '<div id="userinfo" style="display: none;">'
                +'<ul>'
                    +'<li><h3 id=currentusername>User: </h3></li>'
                    +'<li><h3 id=currentusertickets>Tickets: </h3></li>'
                +'</ul>'
            +'</div>';


            // Setter opp skjema for å lage produkt
            productcreation.innerHTML = '<h1>Create Product</h1>'
            +'<form action="#products" method="POST"  name="prodcre" id="prodcre" enctype="multipart/form-data">'
              +'<label for="file">Select product image (MUST BE PNG!)</label>'
              +'<input type="file" id="file" accept="#products"  name="file">'
              +'<br>'
              +'<br>'
              +'<label for="Pname">Choose a product name</label>'
              +'<input type="text" id="pname" name="pname">'
              +'<br>'
              +'<br>'
              +'<label for="description">Write a fitting description</label>'
              +'<input type="text" id="description" name="description">'
              +'<br>'
              +'<br>'
              +'<label for="mincost">Choose a minimum cost</label>'
              +'<input type="number" id="mincost" name="mincost">'
              +'<br>' 
              +'<br>'
              +'<label for="date">Choose a finishing date, format:Sep 3, 2021 12:00:00</label>'
              +'<input type="text" id="date" name="date">'
              +'<br>'
              +'<br>'
              +'<label for="House" class="checkboxes">Housing<input type="checkbox" id="house" name="check" value="house" class="checkboxes"/>'
              +'</label>'
              +'<label for="vehicle" class="checkboxes">Vehicle<input type="checkbox" id="vehicle" name="check" value="vehicle" class="checkboxes"/>'
              +'</label>'
              +'<label for="travel" class="checkboxes">Travel<input type="checkbox" id="travel" name="check" value="travel" class="checkboxes"/>'
              +'</label>'
              +'<label for="furniture" class="checkboxes">Furniture<input type="checkbox" id="furniture" name="check" value="furniture" class="checkboxes"/>'
              +'</label>'
              +'<label for="other" class="checkboxes">Other<input type="checkbox" id="other" name="check" value="other" class="checkboxes"/>'
              +'</label>'
              +'<br>'
              +'<br>'
              +'<br>'
              +'<input type="button" value="Submit" id="createprod">';



            /////////Empties other html divs which are not used on routechange on the new page//////////
            app.innerHTML = "";

            ///////////////EVENT LISTENERS//////////////////
            //Adds eventlisteners
            document.getElementById('userlogo').addEventListener('click',showuser)
            document.getElementById('createprod').addEventListener('click',sendprod)
            document.getElementById('logout').addEventListener('click', logoutconfirmation)
            document.getElementById('file').addEventListener('change', sendimg)

            //////////////FUNCTIONS////////////////
            //Sjekker at brukeren er logget inn og henter ut navn
            $.ajax({
                data: {
                },
                type: "POST",
                url: "/home"
            })
            .done(function(data){
                // Adds userinfo to the userlogo
                document.getElementById('currentusername').innerHTML += `${data[0][0]}`
                document.getElementById('currentusertickets').innerHTML += `${data[0][1]}`
                if (data === "\"Redirect\""){
                    return window.location.hash = '#'
                }
            });

            // Adds products to the database
            async function sendprod(){
                var pname = document.getElementById('pname').value
                var description = document.getElementById('description').value
                var mincost = document.getElementById('mincost').value
                var date = document.getElementById('date').value
                var img = document.getElementById('file').files[0]
                var filter = []
                if (document.querySelector('#house:checked') !== null){
                    filter.push("house")
                }
                if (document.querySelector('#travel:checked') !== null){
                    filter.push("travel")
                }
                if (document.querySelector('#vehicle:checked') !== null){
                    filter.push("vehicle")
                }
                if (document.querySelector('#other:checked') !== null){
                    filter.push("other")
                }
                if (document.querySelector('#furniture:checked') !== null){
                    filter.push("furniture")
                }
                //storeimg(img)

                let response = await fetch("/products",{
                    method: "POST",
                    headers: {
                    "Content-Type": "multipart/form-data",
                    "Content-Transfer-Encoding": "base64"
                    },
                    body:"img="+img+"&pname="+pname+"&description="+description+"&mincost="+mincost+"&date="+date+"&filter="+filter
                });
                if (response.status == 200){
                    let result = await response.text()
                    return window.location.hash = '#home'
                }
            }

            

            function showuser() {
                var user = document.getElementById('userinfo');
                if (user.style.display === "none") {
                    user.style.display = "block";
                } else {
                    user.style.display = "none";
                }
            } 

            break;

        }
        //Default case, if the route the user tries to access isnt defined, the user will get an error message//
        default:
            productcreation.innerHTML = ""

            main.innerHTML = ""
            
            links.innerHTML = ""



            app.innerHTML = 'Error 404: No such path exists';
            break;
    }
}
/////////EVENT LISTENERS//////////////
window.addEventListener('hashchange', onRouteChanged);
window.addEventListener('load', onRouteChanged);
window.addEventListener('file', onchange);
window.addEventListener('createprod', onclick);
window.addEventListener('filterbutton', onclick)


/////////////FUNCTIONS///////////////

//Checks if the user meant to logout, if they wanted to, runs the actual logout function
function logoutconfirmation(){
    let confirmation = confirm("Are you sure you wish to log out?")
    if (confirmation){
        logout()
    }
}

//Sends the image to the backend for processing
async function sendimg(){
    img = document.getElementById('file').files[0]
    let response = await fetch('/imageprocessing', {
        method: "POST",
        header:{
            'content-type': 'image/png'
        },
        body: img
    });
    if (response.status == 200) {
        let result = await response.text()
}
}




//////////////////////Filtration and sorting functions///////////////////////
//Initiates the countdown for filtered products
function startcountdownfilter(listelement) {
    var countdown = new Date(listelement).getTime()
    var currentdate = new Date().getTime();
    var distance = countdown - currentdate;
    var days = Math.floor(distance/(1000*60*60*24))
    var hours = Math.floor((distance%(1000*60*60*24))/(1000*60*60));
    var minutes = Math.floor((distance%(1000*60*60))/(1000*60));
    var seconds = Math.floor((distance%(1000*60))/1000);
    if (distance <= 0){
        days = 0
        hours = 0
        minutes = 0
        seconds = 0
        }
    list = []
    list.push(days,hours,minutes,seconds)
    return list

    }



// Filters products based on the users input
async function filter(written, house, vehicle, travel, furniture, other,Alphabetically,ticketvalue){
    filter = []
    //Filter part
    //Makes sorting possible several times, due to issues with the innerhtml scripts when filtering more than once
    if (house == null){
        written = 'searchbar'
        house = '#house:checked'
        vehicle = '#vehicle:checked'
        travel = '#travel:checked'
        furniture = '#furniture:checked'
        other = '#other:checked'
        Alphabetically = '#Alphabetically:checked'
        ticketvalue = '#Ticket-Value:checked'
    };
    writtenchange = document.getElementById(`${written}`).value
    filter.push(writtenchange)
    if (writtenchange == ""){
        filter.push(" ")
    }
    if (document.querySelector(`${house}`) !== null){
        filter.push("house")
    }
    if (document.querySelector(`${vehicle}`) !== null){
        filter.push("travel")
    }
    if (document.querySelector(`${travel}`) !== null){
        filter.push("vehicle")
    }
    if (document.querySelector(`${other}`) !== null){
        filter.push("other")
    }
    if (document.querySelector(`${furniture}`) !== null){
        filter.push("furniture")
    }
    let response = await fetch('/filter', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body:"filter="+filter
    });
    if (response.status == 200) {
        let result = await response.json()
        products = document.getElementById('products')
        products.innerHTML = ``
        if (result == `No product fits the filter options choosen`){
            alert(result)
            return window.location.reload()
        }
        //Sort part
        sort = []
        if (document.querySelector(`${Alphabetically}`) !== null){
            sort.push("Alpha")
        }
        if (document.querySelector(`${ticketvalue}`) !== null){
            sort.push("ticket")
        }
        //Checks if the user has tried to sort both alphabetically and by ticketcount
        if (result[0].length >= 1){
            if (sort.length > 1){
                alert("You can only sort by one metric")
                window.location.reload()
            }
        //Checks if the user has choosen a sorting metric, if they have to list will be sorted, and afterwards put into the script
        if (sort.length == 1) {
            let result2 = sorted(result,sort[0])
            for (i=0; i<=result2.length-1;i++){
                countdown = startcountdownfilter(result2[i][6])
                products.innerHTML += `<div id="${result2[i][0].toString()}" style=" border:solid; border-width:2px; border-color:#9932cc;">`
                +`<section id="sideomside">`
                +`<h1 id="${result[i][0].toString()}winner" style="display:inline-block;">${result2[i][1]}</h1><br> <button type="button" id="delete" onclick="delete_product(${result2[i][0]})" style="display:inline-block; margin-bottom:2.5%;">DELETE</button>` 
                +`</section>`
                +`<h2>${result2[i][2]}</h2>`
                +`<br>`
                +`<p>${result2[i][3]}</p>`
                +`<h3 style="display:inline-block;" >${result2[i][4]}/${result2[i][5]} tickets</h3>          <h3 style="display:inline-block; margin-left:25%" >${countdown[0]} days:${countdown[1]} hours:${countdown[2]} minutes:${countdown[3]} seconds left</h3>`
                +`<br><br>`
                +`<input type="number" placeholder="How many tickets to use" id="${result2[i][0].toString()}sum"><button type="button" id="submittickets" onclick="pay_for_prod(${result2[i][0]},'${result2[i][0].toString()}sum')">Submit</button> <br><br>`
                +`</div><br><br>`;
            }
        }
        //If no sorting metric has been choosen, the products will be shown in the order that they were created
        else {
        for (i=0; i<=result.length-1;i++){
            countdown = startcountdownfilter(result[i][6])
            products.innerHTML += `<div id="${result[i][0].toString()}" style=" border:solid; border-width:2px; border-color:#9932cc;">`
            +`<section id="sideomside">`
            +`<h1 id="${result[i][0].toString()}winner" style="display:inline-block;">${result[i][1]}</h1><br> <button type="button" id="delete" onclick="delete_product(${result[i][0]})" style="display:inline-block; margin-bottom:2.5%;">DELETE</button>` 
            +`</section>`
            +`<h2>${result[i][2]}</h2>`
            +`<br>`
            +`<p>${result[i][3]}</p>`
            +`<h3 style="display:inline-block;" >${result[i][4]}/${result[i][5]} tickets</h3>          <h3 style="display:inline-block; margin-left:25%" >${countdown[0]} days:${countdown[1]} hours:${countdown[2]} minutes:${countdown[3]} seconds left</h3>`
            +`<br><br>`
            +`<input type="number" placeholder="How many tickets to use" id="${result[i][0].toString()}sum"><button type="button" id="submittickets" onclick="pay_for_prod(${result[i][0]},'${result[i][0].toString()}sum')">Submit</button> <br><br>`
            +`</div><br><br>`;
        }
        }
    }
    }


}

function sorted(list, value){
    console.log(value)
    if (value == "Alpha"){
        //Sorts alphabetically.      [i][1] == product name
        list.sort(function(a,b){
            if (a[1] < b[1]) {
                return -1;
            }
            if (a[1] > b[1]) {
                return 1;
            }
        });
    }
    if (value == "ticket") {
        // Sorts based on highest to lowest ticketcount.  [i][4] == ticketcount
        list.sort(function(a,b){
            return (a[4]===null)-(b[4]===null) || +(a[4]<b[4])||-(a[4]>b[4]);
        });
        }
        return list

        }


/////////////////Main functionality functions//////////////////
//Takes in the amount the user paid for which product and sends it to backend for checks and commits.
async function pay_for_prod(productid,sum){
    sum = document.getElementById(`${sum}`).value
    productid = productid
    let response = await fetch("/payprod",{
        method: "POST",
        headers: {
        'Content-Type': 'application/json'
        },
        body:"prodid="+productid+"&sum="+sum
    });
    if (response.status == 200){
        let result = await response.text()
        if (result == "\"Cant spend tickets on an already sold item\""){
            alert(result)
        }
        if (result == "\"You dont have enough tickets to perform this transaction\""){
            alert(result)
        }
        if (result == "\"Cant spend negative tickets\""){
            alert(result)
        }
        window.location.reload()
    }
};

//Retrieves the product the user wants to delete, and checks if they have the proper authourization.
async function delete_product(productid) {
    let response = await fetch("/deleteprod",{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: "prodid="+productid
    });
    if (response.status == 200) {
        let result = await response.text()
        alert(result)
        window.location.reload()
    }
};

//When the timer for a product is done, this will send the id,current ticketcount and mincost to the backend, to see if a winner can be choosen, and which it will be.
//Afterwards it writes the winner into the product and updates its status, if no winner is chosen, it writes it in the product.
async function choose_winner(id, currentticket, mincost){
    let response = await fetch("/choosewinner", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: "prodid="+id+"&ticketsspent="+currentticket+"&mincost="+mincost
    });
    if (response.status == 200) {
        let result = await response.text()
        if (result == "\"null\""){
            document.getElementById(`${id}winner`).innerHTML += `<h2>NO WINNER, TICKETS WILL BE RETURNED TO USERS</h2>`
        }
        else {
            document.getElementById(`${id}winner`).innerHTML += `<h1>WINNER:${result}</h1>`
        }
    }
                
}

//Logs the user out and returns them to the login page
async function logout(){
    let confirmation = confirm("Are you sure you want to log out?")
    if (confirmation) {
    let response = await fetch('/logout', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: "Logout"
    });
    if (response.status == 200) {
        let result = await response.text()
        window.location.hash = '#'
        window.location.reload()
}
}
}