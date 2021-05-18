

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
            +'</section>'
            +'<div id="userinfo" style="display: none;">'
                +'<ul>'
                    +'<li><h3 id=currentusername>User: </h3></li>'
                    +'<li><h3 id=currentusertickets>Tickets: </h3></li>'
                +'</ul>'
            +'</div>';

            //Checks that the user is actually validated, and gives the user information about its profile
            $.ajax({
                data: {
                },
                type: "POST",
                url: "/home"
            })
            .done(function(data){
                console.log(data[0][0])
                showproducts(data)
                document.getElementById('currentusername').innerHTML += `${data[0][0]}`
                document.getElementById('currentusertickets').innerHTML += `${data[0][1]}`
                if (data === "\"Redirect\""){
                    return window.location.hash = '/'
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

            function showproducts(data){
                console.log('Er inni produkt funk')
                products = document.getElementById('products')
                console.log(data.length)
                for (i=0; i<data[1].length;i++){

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

                    countdown = startcountdown(data)
                    console.log(countdown)

                    

                    
                    products.innerHTML += `<div id="${data[1][i][0].toString()}">`
                    +`<h1 id="${data[1][i][0].toString()}winner">${data[1][i][1]}</h1><br> <button type="button" id="delete + " onclick="delete_product(${data[1][i][0]})">DELETE</button>` 
                    +`<h2>${data[1][i][2]}</h2>`
                    +`<br>`
                    +`<p>${data[1][i][3]}</p>`
                    +`<h3>${data[1][i][4]}/${data[1][i][5]} tickets</h3>          <h3>${countdown[0]} days:${countdown[1]} hours:${countdown[2]} minutes:${countdown[3]} seconds left</h3>`
                    +`<br><br>`
                    +`<input type="number" placeholder="How many tickets to use" id="${data[1][i][0].toString()}sum"><button type="button" id="submittickets + " onclick="pay_for_prod(${data[1][i][0]},'${data[1][i][0].toString()}sum')">Submit</button> <br><br>`
                    +`</div>`;
                    if (i == data.length){
                        products.innerHTML += ``;
                    }
                    
                }
            }; 
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
            
            document.getElementById('createprod').addEventListener('click',sendprod)
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
                    return window.location.hash = '/'
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
                //var filter = document.getElementById('check').value
                // var reader = new FileReader();
                // reader.onload = function(){
                //     base64string = reader.result.replace("data:", "").replace(/^.+,/, "");
                //     console.log(base64string)
                // }

                // img = reader.readAsDataURL(img)
                // var list = []
                // list.push(pname,description,mincost,date,img)
                // var img = function uploadImage(event) {
                //     let data = new FormData();
                //     data.append('name', 'my-img');
                //     data.append('file', event.target.files[0]);
                //     return data
                //     }
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
                    console.log(result)
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
        if (result == "\"null\""){
            document.getElementById(`${id}winner`).innerHTML += `NO WINNER, TICKETS WILL BE RETURNED TO USERS`
        }
        else {
            document.getElementById(`${id}winner`).innerHTML += `         WINNER:${result}`
        }
    }
                
}