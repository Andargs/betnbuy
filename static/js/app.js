
async function onRouteChanged() {
    const hash = window.location.hash;
    const app = document.getElementById('app');
    const links = document.getElementById('links')
    const main = document.getElementById("main")
    const user = document.getElementById("user");


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

            

        //     links.innerHTML = '<nav>'
        //     +'<ul>'
        //         +'<li><a href=""><i class="fa fa-home"></i></a></li>'
        //         +'<li><a href=""><i class="fa fa-user"></i></a></li>'
        //         +'<li><a href=""><i class="fa fa-shopping-cart"></i></a></li>'
        //     +'</ul>'
        // +'</nav>'
            
            break;
        }
        

        case '#home': {
            links.innerHTML = '<nav>'
            +'<ul>'
                +'<li><a href="#home"><i class="fa fa-home"></i></a></li>'
                +'<li><a href="" onclick="showuser()"><i class="fa fa-user"></i></a></li>'
                +'<li><a href=""><i class="fa fa-shopping-cart"></i></a></li>'
            +'</ul>'
            +'</nav>';
            //main.innerHTML = '<h1 action="/home">{ currentuser } </h1>';
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
                    x.style.display = "none";
                }
            } 
            
            
            console.log(currentuser)

            
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





