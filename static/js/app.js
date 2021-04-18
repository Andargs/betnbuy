

//spørr om login i forhold til flask også
async function onRouteChanged() {
    const hash = window.location.hash;
    const app = document.getElementById('app');
    const links = document.getElementById('links')
    console.log(window.location.hash)


    if (!(app instanceof HTMLElement)) {
        throw new ReferenceError('No path element made')
    }
    switch (hash) {
        case '':
        case '/':
            app.innerHTML = '<h1><a href=""></a><i class="fa fa-user-circle" style="font-size: 3em"></i></h1>'
            +'<h1 id="overskrift"> Login </h1>'
            +'<br>'
            +'<br>'
            +'<form method="POST">'
            +'<input type="text" placeholder="Username" id="username" required>'
            +'<br>'
            +'<br>'
            +'<input type="password" placeholder="Password" id="password" required>'
            +'<br>'
            +'<br>'
            +'<input type="submit" value="Login" id="login">'
            +'<br>'
            +'<a href="#register" id="refern">Register user</a>'
            +'</form>';

            currentroute = JSON.stringify(hash)
            

            break;

        case '#register':
            app.innerHTML = '<h1><a href=""></a><i class="fa fa-user-plus" style="font-size: 3em"></i></h1>'
            +'<h1 id="overskriftreg"> Register User </h1>'
            +'<br>'
            +'<br>'
            +'<form method="POST">'
            +'<input type="text" placeholder="Username" id="username" required>'
            +'<br>'
            +'<br>'
            +'<input type="text" placeholder="Email" id="email" required>'
            +'<br>'
            +'<br>'
            +'<input type="password" placeholder="Password" id="passwordreg" required>'
            +'<br>'
            +'<br>'
            +'<input type="password" placeholder="Confirm Password" id="confpass" required>'
            +'<input type="submit" value="Register" id="submit">'
            +'</form>';
            currentroute = JSON.stringify(hash)
            


        //     links.innerHTML = '<nav>'
        //     +'<ul>'
        //         +'<li><a href=""><i class="fa fa-home"></i></a></li>'
        //         +'<li><a href=""><i class="fa fa-user"></i></a></li>'
        //         +'<li><a href=""><i class="fa fa-shopping-cart"></i></a></li>'
        //     +'</ul>'
        // +'</nav>'
            break;

        default:
            app.innerHTML = 'Error 404: No such path exists';
            break;
    }
}

window.addEventListener('hashchange', onRouteChanged);
window.addEventListener('load', onRouteChanged);








    // if (CurrPath == '/'){
        // app.innerHTML = '<h1><a href=""></a><i class="fa fa-user-circle" style="font-size: 3em"></i></h1>'
        // +'<h1 id="overskrift"> Login </h1>'
        // +'<br>'
        // +'<br>'
        // +'<form method="POST">'
        // +'<input type="text" placeholder="Username" id="username" required>'
        // +'<br>'
        // +'<br>'
        // +'<input type="text" placeholder="Password" id="password" required>'
        // +'<br>'
        // +'<br>'
        // +'<input type="submit" value="Login" id="login">'
        // +'<br>'
        // +'<a route="/register" id="refern">Register user</a>'
        // +'</form>'
    // }

//     else if (CurrPath == '/register') {
        // app.innerHTML = '<h1><a href=""></a><i class="fa fa-user-plus" style="font-size: 3em"></i></h1>'
        // +'<h1 id="overskriftreg"> Register User </h1>'
        // +'<br>'
        // +'<br>'
        // +'<form method="POST">'
        // +'<input type="text" placeholder="Username" id="username" required>'
        // +'<br>'
        // +'<br>'
        // +'<input type="text" placeholder="Email" id="email" required>'
        // +'<br>'
        // +'<br>'
        // +'<input type="text" placeholder="Password" id="passwordreg" required>'
        // +'<br>'
        // +'<br>'
        // +'<input type="text" placeholder="Confirm Password" id="confpass" required>'
        // +'<input type="submit" value="Register" id="submit">'
        // +'</form>'
//     }
// }