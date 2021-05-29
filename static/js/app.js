

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

            //Gjør at brukeren kan navigere siden
            links.innerHTML = '<nav>'
            +'<ul>'
                +'<li ><i id="logout" class="fa fa-user-times"></i></li>'
                +'<li><a href="#home"><i class="fa fa-home"></i></a></li>'
                +'<li ><i id="userlogo" class="fa fa-user"></i></li>'
                +'<li><a href="#products"><i class="fa fa-shopping-cart"></i></a></li>'
            +'</ul>'
            +'</nav>';

            app.innerHTML = "";

            productcreation.innerHTML = "";
            
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
              +`<button id="filterbutton" onclick="filter('searchbar', '#house:checked', '#vehicle:checked', '#travel:checked', '#furniture:checked', '#other:checked')">Filter</button>`
            +'</section>'
            +'<section id="products">'
            +'</section>'
            +'<div id="userinfo" style="display: none;">'
                +'<ul>'
                    +'<li><h3 id=currentusername>User: </h3></li>'
                    +'<li><h3 id=currentusertickets>Tickets: </h3></li>'
                +'</ul>'
            +'</div>';
            // Add eventlisteners to run functions properly
            document.getElementById('filterbutton').addEventListener('filterbutton', onclick)
            document.getElementById('userlogo').addEventListener('click',showuser)
            document.getElementById('logout').addEventListener('click', logoutconfirmation)

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
                console.log(data[0][0])
                showproducts(data)
                console.log(data[0][0])
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
                    console.log('oi')
                    user.style.display = "block";
                } else {
                    user.style.display = "none";
                    console.log('romba')
                }
            }


            // Shows the products on load
            function showproducts(data){
                console.log('Er inni produkt funk')
                products = document.getElementById('products')
                console.log(data.length)
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
                    image = localStorage.getItem("HER TRENGER JEG produktid")
                    countdown = startcountdown(data)
                    //Adds product in html
                    products.innerHTML += `<div id="${data[1][i][0].toString()}" style=" border:solid; border-width:2px; border-color:#9932cc;">`
                    +`<section id="sideomside">`
                    +`<h1 style="display:inline-block;" id="${data[1][i][0].toString()}winner">${data[1][i][1]}</h1><button type="button" id="delete" onclick="delete_product(${data[1][i][0]})" style="display:inline-block;">DELETE</button>` 
                    +`</section>`
                    +`<h2 id="${data[1][i][0].toString()}img">${data[1][i][2]}</h2>`
                    +`<br>`
                    +`<p>${data[1][i][3]}</p>`
                    +`<h3 style="display:inline-block;">${data[1][i][4]}/${data[1][i][5]} tickets spent</h3>          <h3 style="display:inline-block; margin-left:25%" >Time left: ${countdown[0]} days:${countdown[1]} hours:${countdown[2]} minutes:${countdown[3]} seconds</h3>`
                    +`<br><br>`
                    +`<input type="number" placeholder="How many tickets to use" id="${data[1][i][0].toString()}sum"><button type="button" id="submittickets" onclick="pay_for_prod(${data[1][i][0]},'${data[1][i][0].toString()}sum')">Submit</button> <br><br>`
                    +`</div>`
                    +`<br><br>`
                    if (i+1 == data[1].length){
                        console.log("legg til bilde")
                    }
                    
                }
            }; 
            break;
        }

        case '#products':  {
            // Setter opp navigeringen for brukeren
            links.innerHTML = '<nav>'
            +'<ul>'
                +'<li ><i id="logout" class="fa fa-user-times"></i></li>'
                +'<li><a href="#home"><i class="fa fa-home"></i></a></li>'
                +'<li ><i id="userlogo" class="fa fa-user"></i></li>'
                +'<li><a href="#products"><i class="fa fa-shopping-cart"></i></a></li>'
            +'</ul>'
            +'</nav>';

            app.innerHTML = "";

            main.innerHTML = '<div id="userinfo" style="display: none;">'
                +'<ul>'
                    +'<li><h3 id=currentusername>User: </h3></li>'
                    +'<li><h3 id=currentusertickets>Tickets: </h3></li>'
                +'</ul>'
            +'</div>';


            // Setter opp skjema for å lage produkt
            productcreation.innerHTML = '<h1>Create Product</h1>'
            +'<form action="#products" method="POST"  name="prodcre" id="prodcre" enctype="multipart/form-data">'
              +'<label for="file">Select product image (MUST BE JPG OR PNG!)</label>'
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

            //Adds eventlisteners
            document.getElementById('userlogo').addEventListener('click',showuser)
            document.getElementById('createprod').addEventListener('click',sendprod)
            document.getElementById('logout').addEventListener('click', logoutconfirmation)
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
                console.log(data)
                if (data === "\"Redirect\""){
                    return window.location.hash = '#'
                }
            });

            
            
            // Sender form sånn at brukerens produkt kan lagres i databasen
            // $(document).ready(function() {
            //     $('form').on('submit', function(event) {
            //         // function uploadfile(file) {
            //         //     var reader = new FileReader();
            //         //     reader.onloadend = function() {
            //         //         var data =(reader.result).split(',')[1];
            //         //         console.log(data)
            //         //         var img = atob(data)
            //         //         console.log('BINARY AV BILDE: ', img)
            //         //         return img
            //         //     }
            //         //     return img
            //         // }
            //         // var img = uploadfile(document.getElementById('file').files[0])
            //         var img = function uploadImage(event) {
            //             const URL = "/products";
            //             let data = new FormData();
            //             data.append('name', 'my-img');
            //             data.append('file', event.target.files[0]);
            //             return data
            //         }
            //         var filter =  []
            //         $.each($("input[name='check']:checked"), function(){
            //             filter.push($(this).val().toString());
            //             });
            //         $.ajax({
            //             data: {
            //                 image: img,
            //                 pname: $('#pname').val().toString(),
            //                 description: $('#description').val().toString(),
            //                 mincost: $('#mincost').val().toString(),
            //                 date: $('#date').val().toString(),
            //                 filter: filter

            //             },
            //             type: "POST",
            //             url: "/products",
            //             enctype: 'multipart/form-dat',
            //             processData: false,
            //             contentType: false
            //         })
            //         .done(function(data){
            //             console.log('Data sendt')
            //             console.log(data)
            //             if (data !== "\"False\""){
            //                 return window.location.reload()
            //             }
            //             else if (data == "\"False\"") {
            //                 return window.location.hash = '#home'
            //             }
            //         });
            //         event.preventDefault()
            //     });
            // });

            // function formdata() {
            //     var formdata = new FormData();
            //     var target = "/products"
            //     formdata.append("file", document.getElementById("file").files[0]);
            //     formdata.append("#pname", document.getElementById("#pname").val())
            //     console.log(formdata)
            //     console.log("ER I FUNKSJONEN")
            //     var xhr = XMLHttpRequest();
            //     var eventsource = xhr.upload || xhr;
            //     eventsource.addEventListener("progress",function(e){
            //         var current = e.loaded || e.position;
            //         var total = e.total || e.totalsize;
            //         var percent = parseInt((current/total)*100,10);
            //     });
            //     xhr.open("POST", target, true);
            //     xhr.send(formdata)
            //     xhr.onload = function() {
            //         if (this.status == 200) {
            //             return window.location.hash = "#home"
            //         }
            //         else {
            //             return window.location.reload()
            //         }
            //     }
            // }

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
            productcreation.innerHTML = ""

            main.innerHTML = ""
            
            links.innerHTML = ""



            app.innerHTML = 'Error 404: No such path exists';
            break;
    }
}

window.addEventListener('hashchange', onRouteChanged);
window.addEventListener('load', onRouteChanged);
window.addEventListener('file', onchange);
window.addEventListener('createprod', onclick);
window.addEventListener('filterbutton', onclick)


function logoutconfirmation(){
    let confirmation = confirm("Are you sure you wish to log out?")
    if (confirmation){
        logout()
    }
}


// function storeimg(img) {
//     bannerImage = document.getElementById('file').files[0];
//     imgData = getBase64Image(bannerImage);
//     localStorage.setItem("imgData", imgData);  
// }

// function getBase64Image(img) {
//     var canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;

//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);

//     var dataURL = canvas.toDataURL("image/png");

//     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
// }

function storeimg(img){
    var img1 = new Image();
    img1.src = img
    console.log(img)
    console.log(img1)
    var imgcanvas = document.createElement("canvas");
    var imgcontext = imgcanvas.getContext("2d");
    imgcanvas.width = img1.width
    imgcanvas.height = img1.height
    imgcontext.drawImage(img1,0,0,img1.width,img1.height);
    var imgAsDataURL = imgcanvas.toDataURL("image/png");
    try {
        localStorage.setItem("ImgData",imgAsDataURL)
    }
    catch (e) {
        console.log("Upload failed: " + e)
    }
}

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


async function getusername() {
    
    let response = await fetch('/');
    if (response.status==200){
        console.log('oi')
        let result = await response.json();
        if (result) {
            window.location.hash = '#home'
            console.log(result)
            return result
        }
        return null
    }
};


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

async function filter(written, house, vehicle, travel, furniture, other){
    filter = []
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
        console.log(result)
        console.log(result[0])
        if (result == `No product fits the filter options choosen`){
            alert(result)
            return window.location.reload()
        }
        if (result[0].length > 3){
        for (i=0; i<=result.length;i++){
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

            window.location.hash = "#home"
        }
    }
        if (result.length >= 1){
            countdown = startcountdownfilter(result[6])
            products.innerHTML += `<div id="${result[0].toString()}" style=" border:solid; border-width:2px; border-color:#9932cc;">`
            +`<section id="sideomside">`
            +`<h1 id="${result[0].toString()}winner" style="display:inline-block;">${result[1]}</h1><br> <button type="button" id="delete" onclick="delete_product(${result[0]})" style="display:inline-block;">DELETE</button>` 
            +`</section>`
            +`<h2>${result[2]}</h2>`
            +`<br>`
            +`<p>${result[3]}</p>`
            +`<h3 style="display:inline-block;">${result[4]}/${result[5]} tickets spent</h3>          <h3 style="display:inline-block;>Time Left: ${countdown[0]} days:${countdown[1]} hours:${countdown[2]} minutes:${countdown[3]} seconds left</h3>`
            +`<br><br>`
            +`<input type="number" placeholder="How many tickets to use" id="${result[0].toString()}sum"><button type="button" id="submittickets" onclick="pay_for_prod(${result[0]},'${result[0].toString()}sum')">Submit</button> <br><br>`
            +`</div><br><br>`;

            window.location.hash = "#home"
        }

    }


}


async function pay_for_prod(productid,sum){
    sum = document.getElementById(`${sum}`).value
    console.log(sum)
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
        console.log(result)
        if (result == "\"null\""){
            document.getElementById(`${id}winner`).innerHTML += `<h2>NO WINNER, TICKETS WILL BE RETURNED TO USERS</h2>`
        }
        else {
            document.getElementById(`${id}winner`).innerHTML += `<h1>WINNER:${result}</h1>`
        }
    }
                
}