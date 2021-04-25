
async function onRouteChanged() {
    const hash = window.location.hash;
    const app = document.getElementById('app');
    const links = document.getElementById('links')
    const main = document.getElementById("main")
    const user = document.getElementById("userinfo");


    if (!(app instanceof HTMLElement)) {
        throw new ReferenceError('No path element made')
    }
    switch (hash) {
        case '':
        case '/': {

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
            links.innerHTML = '<nav>'
            +'<ul>'
                +'<li><a href="#home"><i class="fa fa-home"></i></a></li>'
                +'<li><i onclick="showuser()" class="fa fa-user"></i></li>'
                +'<li><a href="#products"><i class="fa fa-shopping-cart"></i></a></li>'
            +'</ul>'
            +'</nav>';

            user.innerHTML = '<ul>'
                +'<li><h3>User: Userfromerik</h3></li>'
                +'<li><h3>Tickets: 941</h3></li>'
                +'<li><h3>Products: Hus i spania, bil fra romerike</h3></li>'
            +'</ul>';
            
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
            +'</section>';

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
            });

            function showuser() {
                if (user.style.display === "none") {
                    user.style.display = "block";
                } else {
                    user.style.display = "none";
                }
            } 
            
            
            console.log(currentuser)

            
            break;
        }

        case '#products':  {
            links.innerHTML = '<nav>'
            +'<ul>'
                +'<li><a href="#home"><i class="fa fa-home"></i></a></li>'
                +'<li><a href="" onclick="showuser()"><i class="fa fa-user"></i></a></li>'
                +'<li><a href=""><i class="fa fa-shopping-cart"></i></a></li>'
            +'</ul>'
            +'</nav>';
            


            $.ajax({
                data: {
                },
                type: "POST",
                url: "/products"
            })
            .done(function(data){
                console.log(data)
                if (data === "\"Redirect\""){
                    return window.location.hash = '/'
                }
            });


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





