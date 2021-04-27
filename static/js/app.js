//spørr om toggling av user data, om hvordan login egentlig skal gjøres, og hvordan man får satt data 
//fra 2 forskjellige ajax statements sammen. 
//Spørr hva som er galt med skjemaet.
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
                        console.log('Data sendt')
                        console.log(data)
                        if (data !== "\"False\""){
                            return window.location.hash = '#home'
                        }
                        else if (data == "\"False\"") {
                            return window.location.reload()
                        }
                    });
                    event.preventDefault()
                });
            });
                        
            break;
        }

        case '#register': {
            
            links.innerHTML = "";

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
                        
                    });
                    event.preventDefault()
                });
            });
            
            break;
        }
        

        case '#home': {

            //Gjør at brukeren kan navigere siden
            links.innerHTML = '<nav>'
            +'<ul>'
                +'<li><a href="#home"><i class="fa fa-home"></i></a></li>'
                +'<li ><i id="userlogo" class="fa fa-user"></i></li>'
                +'<li><a href="#products"><i class="fa fa-shopping-cart"></i></a></li>'
            +'</ul>'
            +'</nav>';

            document.getElementById('userlogo').addEventListener('click',showuser)


            app.innerHTML = "";

            // user.innerHTML = '<ul>'
            //     +'<li><h3>User: Userfromerik</h3></li>'
            //     +'<li><h3>Tickets: 941</h3></li>'
            //     +'<li><h3>Products: Hus i spania, bil fra romerike</h3></li>'
            // +'</ul>';
            
            productcreation.innerHTML = "";
            
            //Fyller inn siden med filtrering og produkter
            main.innerHTML = '<section id="filter">'
            +'<h3>Filter Search</h3>'
            +'<input type="text" placeholder="Search..." name="searchbar" id="searchbar"><br>'
            +'<br>'
            +'<br>'
            +'<label for="house" class="checkboxes">Housing<input type="checkbox" id="house" name="house" value="house" class="checkboxes"/>'
              +'</label>'
              +'<br>'
              +'<br>'
              +'<label for="vehicle" class="checkboxes">Vehicle<input type="checkbox" id="vehicle" name="vehicle" value="vehicle" class="checkboxes"/>'
              +'</label>'
              +'<br>'
              +'<br>'
              +'<label for="travel" class="checkboxes">Travel<input type="checkbox" id="travel" name="travel" value="travel" class="checkboxes"/>'
              +'</label>'
              +'<br>'
              +'<br>'
              +'<label for="furniture" class="checkboxes">Furniture<input type="checkbox" id="furniture" name="furniture" value="furniture" class="checkboxes"/>'
              +'</label>'
              +'<br>'
              +'<br>'
              +'<label for="other" class="checkboxes">Other<input type="checkbox" id="other" name="other" value="other" class="checkboxes"/>'
              +'</label>'
            +'</section>'
            +'<section id="products">'
            +'<h1>hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</h1>'
            +'</section>'
            +'<div id="userinfo" style="display: none;">'
                +'<ul>'
                    +'<li><h3>User: Userfromerik</h3></li>'
                    +'<li><h3>Tickets: 941</h3></li>'
                    +'<li><h3>Products: Hus i spania, bil fra romerike</h3></li>'
                +'</ul>'
            +'</div>';


            //Sjekker at brukeren er logget inn
            $.ajax({
                data: {
                },
                type: "POST",
                url: "/home"
            })
            .done(function(data){
                console.log(data)
                if (data === "\"Redirect\""){
                    return window.location.hash = '/'
                }
                else {
                    insertuserdata()
                }
            });

            //Gjør sånn at bruker kan se sine egne data. Tickets, Brukernavn og egne produkter
            function showuser() {
                var user = document.getElementById('userinfo');
                if (user.style.display === "none") {
                    console.log('oi')
                    user.style.display = "block";
                } else {
                    user.style.display = "none";
                    console.log('romba')
                }
            } 

            function insertuserdata() {
                null
            }
            
            
            console.log(currentuser)

            
            break;
        }

        case '#products':  {
            // Setter opp navigeringen for brukeren
            links.innerHTML = '<nav>'
            +'<ul>'
                +'<li><a href="#home"><i class="fa fa-home"></i></a></li>'
                +'<li ><i id="userlogo" class="fa fa-user"></i></li>'
                +'<li><a href="#products"><i class="fa fa-shopping-cart"></i></a></li>'
            +'</ul>'
            +'</nav>';

            document.getElementById('userlogo').addEventListener('click',showuser)

            app.innerHTML = "";

            main.innerHTML = '<div id="userinfo" style="display: none;">'
                +'<ul>'
                    +'<li><h3>User: Userfromerik</h3></li>'
                    +'<li><h3>Tickets: 941</h3></li>'
                    +'<li><h3>Products: Hus i spania, bil fra romerike</h3></li>'
                +'</ul>'
            +'</div>';


            // Setter opp skjema for å lage produkt
            productcreation.innerHTML = '<h1>Create Product</h1>'
            +'<form action="#products" method="POST" enctype="multipart/form-data">'
              +'<label for="file">Select product image</label>'
              +'<input type="file" id="file" name="file">'
              +'<br>'
              +'<br>'
              +'<label for="Pname">Choose a product name</label>'
              +'<input type="text" id="Pname" name="Pname">'
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
              +'<br>'
              +'<input type="submit" value="Submit" id="createprod">';
            

            //Sjekker at brukeren er logget inn og henter ut navn
            $.ajax({
                data: {
                },
                type: "POST",
                url: "/home"
            })
            .done(function(data){
                const currentname = data.substring(3, data.indexOf(',')-1);
                console.log(currentname)
                console.log(data)
                if (data === "\"Redirect\""){
                    return window.location.hash = '/'
                }
            });

            
            
            // Sender form sånn at brukerens produkt kan lagres i databasen
            $(document).ready(function() {
                $('form').on('submit', function(event) {
                    $.ajax({
                        data: {
                            owner: currentname,
                            img: $('#file').val(),
                            Pname: $('#password').val(),
                            description: $('#description').val(),
                            mincost: $('#mincost').val(),
                            date: $('#date').val()
                        },
                        type: "POST",
                        url: "/products",
                        enctype: 'multipart/form-dat'
                    })
                    .done(function(data){
                        console.log('Data sendt')
                        console.log(data)
                        if (data !== "\"False\""){
                            return window.location.reload()
                        }
                        else if (data == "\"False\"") {
                            return window.location.hash = '#home'
                        }
                    });
                    event.preventDefault()
                });
            });

            function showuser() {
                var user = document.getElementById('userinfo');
                if (user.style.display === "none") {
                    console.log('oi')
                    user.style.display = "block";
                } else {
                    user.style.display = "none";
                    console.log('romba')
                }
            } 

            break;

        }

        default:
            app.innerHTML = 'Error 404: No such path exists';
            break;
    }
}

window.addEventListener('hashchange', onRouteChanged);
window.addEventListener('load', onRouteChanged);



async function getusername() {
    
    let response = await fetch('/');
    if (response.status==200){
        console.log('oi')
        let result = await response.json();
        //if (currentuser) {
                        //    window.location.hash = '#home'
                        //}
        if (result) {
            window.location.hash = '#home'
            console.log(result)
            return result
        }
        return null
    }
};





