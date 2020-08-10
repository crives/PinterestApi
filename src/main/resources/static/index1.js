function initialize() {
    renderModal("createPin", "modals");
    getPins("/api/pins");
}

function getPins(url) {
    var xhttpList = new XMLHttpRequest();
    xhttpList.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            renderPin(this.responseText);
        }
    };
    xhttpList.open("GET", url, true);
    xhttpList.send();
    console.log("Pins received");
}

function getOnePin(id) {
    var url = "/api/pins/" + id;
    var xhttpList = new XMLHttpRequest();
    xhttpList.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            sessionStorage.setItem("pin", this.responseText);
        }
    };
    xhttpList.open("GET", url, false);
    xhttpList.send();
    console.log("Single pin retrieved");

    return sessionStorage.getItem("pin");
}

function getPinsFromFrance(){
    var display = document.getElementById("pins");
    display.innerHTML = '';
    document.getElementById("title").innerHTML = "France Board";
     
    if (document.contains(document.getElementById("createpin"))) {
        document.getElementById("createpin").remove();
    }  
    getPins("/api/pins/paris");
}


function getPetsPins(){
    var display = document.getElementById("pins");
    display.innerHTML = '';
    document.getElementById("title").innerHTML = "Pets Board";
    
    if (document.contains(document.getElementById("createpin"))) {
        document.getElementById("createpin").remove();
    }  
    getPins("/api/pins/pets");
}


function renderPin(data) {
    var json = JSON.parse(data);

    for (var index = 0; index < json.length; index++) {
        var cardHtml = 
            '<div class="card crd--effect-3 border-0" style="max-width:350px; background-color: black;" id="' + json[index].id + '">'
                + '<div class="crd-img container">'
                    + '<img class="crd-img" style="width:100%; height:50%" src="' + json[index].imagePath + '">'
                        + '<h2 class=crd-heading" style="margin-bottom:0; color:#6F7474">' + '<span>' + json[index].title 
                            + '<div class="btn update-btn" id="update' + json[index].id + '">' + '</div>'
                        + '<button class="btn btn-light" style ="color:#6F7474; border:#333637; background-color:#333637"' + 
                        'onclick="deletePin(' + json[index].id + ')">Delete</button>'
                        + '</h2>'
                        + '<span>'          
                        + '<div>' + '<p class="crd-text bottom-right" style="color:#6F7474">' + json[index].category + '</p>'
                        + '</div>'
                        + '<div>' + '<p class="crd-text" style="color:#6F7474">' + json[index].description + '</p>'
                        + '</div>'
                + '</div>'
            + '</div>';

        console.log("Pin Card with ID: " + json[index].id + " created");

          var cardDeck;
             cardDeck = document.createElement("div");
             cardDeck.id = "deck" + index;
             document.getElementById("pins").appendChild(cardDeck);
             cardDeck = document.getElementById("deck" + index);

        cardDeck.insertAdjacentHTML('beforeend', cardHtml);
        renderModal("updatePin", json[index].id);
    }

}

function renderModal(modalPurpose, id) {
    var location;
    var color;
    var btntxt;
    var pin;
    var pinID = '';
    var style;

    switch (modalPurpose) {
        case "createPin":
            location = id;
            color = "btn-light";
            btntxt = "Create Pin";
            title = 'Create Pin';
            createID = 'createpin';
            style = 'color:#6F7474; border:#333637; background-color:#333637"'
            break;
        case "updatePin":
            pin = getOnePin(id);
            pinID = JSON.parse(pin).id;
            location = "update" + id;
            color = "btn-light";
            btntxt = "Update";
            title = 'Update Pin';
            style = 'color:#6F7474; border:#333637; background-color:#333637"'
            break;
    }

    var buttonHtml = '<button type="button" id="' + createID + '" class="btn ' + color + '" style=" ' + style + '" data-toggle="modal" data-target="#' + modalPurpose + pinID + '">' + btntxt + '</button>';
    document.getElementById(location).insertAdjacentHTML('beforeend', buttonHtml);

    var modalHtml = ' <div class="modal fade" id="' + modalPurpose + pinID + '"> '
        + ' <div class="modal-dialog modal-xl"> '
        + ' <div class="modal-content"> '

        + '<div class="modal-header">'
        + '<h4 class="modal-title">' + title + '</h4>'
        + '<button type="button" class="close" data-dismiss="modal">&times;</button>'
        + '</div>'

        + '<div class="modal-body">'
        + pinForm(pin, modalPurpose)
        + '</div>'

        + '<div class="modal-footer">'
        + '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
        + '</div>'

        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';

    document.getElementById("modals").insertAdjacentHTML('beforeend', modalHtml);

}

function addPin(id) {
     var link = "/api/add/pin/" + id;
     console.log("Loaded into add function");
 
     var ok = confirm("Are you sure you want to add?\nPress 'OK' to confirm, or 'cancel' to cancel");
     if (ok == true) {
 
         var xhttp = new XMLHttpRequest();
         xhttp.open("POST", link, true);
 
         xhttp.onreadystatechange = function () {
             if (this.readyState == 4 && this.status == 200) {
                 var addCard = document.getElementById(id);
                 addCard.parentNode.appendChild(addCard);
                 console.log("Pin added.");
             }
         };
         xhttp.send(null);  // No data to be sent in body
    }
}

function createPin() {   // Ensure you have the correct verb, URI, and headers set. 
    var sendData = {
        "title": document.getElementById("createPintitle").value,
        "imagePath": document.getElementById("createPinimagePath").value,
        "category": document.getElementById("createPincategory").value,
        "description": document.getElementById("createPindescription").value
    }
    console.log(sendData);

    var ok = confirm("Ready to send?");

    if (ok == true) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/api/create/pin", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Update success");
                var display = document.getElementById("pins");
                display.innerHTML = '';
                getPins("/api/pins");
                console.log("Pin created!");
            }
        };
        xhttp.send(JSON.stringify(sendData));
    }

}

function deletePin(id) {
    var link = "/api/delete/pin/" + id;
    console.log("Loaded into delete function");

    var ok = confirm("Are you sure you want to delete?\nPress 'OK' to confirm, or 'cancel' to cancel");
    if (ok == true) {

        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", link, true);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var removeCard = document.getElementById(id);
                removeCard.parentNode.removeChild(removeCard);
                console.log("Pin deleted.");
            }
        };
        xhttp.send(null); // No data to be sent in body

    }
}

function updatePin(id) {
    var sendData = {
        "id": id,
        "title": document.getElementById("updatePintitle"+id).value,
        "imagePath": document.getElementById("updatePinimagePath"+id).value,
        "category": document.getElementById("updatePincategory"+id).value,
        "description": document.getElementById("updatePindescription"+id).value
    }
    console.log(sendData);

    var ok = confirm("Please confirm you wish to apply these changes");

    if (ok == true) {      // Just like create, we set our headers to show our data is JSON
        var xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "/api/update/pin", true);
        xhttp.setRequestHeader('content-Type', 'application/json');
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Update success");
                var display = document.getElementById("pins");
                display.innerHTML = '';
                getPins("/api/pins");
            }
        };
        xhttp.send(JSON.stringify(sendData));
    }
}

function pinForm(id, purpose) {
    var input;
    var id;
    var title;
    var category;
    var imagePath;
    var description;
    var action;

    switch (purpose) {
        case "createPin":
            input = '';
            id ='';
            title = '';
            category = '';
            imagePath = '';
            description = '';
            action = 'createPin()';
            break;
        case "updatePin":
            input = JSON.parse(id);
            id = input.id;
            title = input.title;
            category = input.category;
            imagePath = input.imagePath;
            description = input.desription;
            action = 'updatePin(' + input.id + ')';
            break;
    }

    var form = ''
        + '<form>'
        + '<div class="input-group mb-3">'
        + '<div class="input-group-prepend">'
        + '<span class="input-group-text">Title</span>'
        + '</div>'
        + '<input type="text" class="form-control" placeholder="Enter Title" id="' + purpose + 'title' + id +'" value="' + title + '">'
        + '</div>'
        + '<div class="input-group mb-3">'
        + '<div class="input-group-prepend">'
        + '<span class="input-group-text">Category</span>'
        + '</div>'
        + '<input type="text" class="form-control" placeholder="Enter Category" id="' + purpose + 'category' + id +'" value="' + category + '">'
        + '</div>'
        + '<div class="input-group mb-3">'
        + '<div class="input-group-prepend">'
        + '<span class="input-group-text">Image URL</span>'
        + '</div>'
        + '<input type="text" class="form-control" placeholder="Enter Image URL" id="' + purpose + 'imagePath' + id +'" value="' + imagePath + '">'
        + '</div>'
        + '<div class="input-group mb-3">'
        + '<div class="input-group-prepend">'
        + '<span class="input-group-text">Description</span>'
        + '</div>'
        + '<input type="text" class="form-control" placeholder="Enter Description" id="' + purpose + 'description' + id +'" value="' + description + '">'
        + '</div>'
        + '<button type="submit" class="btn" style ="color:#A6B8B8; border:#333637; background-color: #545C5C" data-dismiss="modal" onclick="' + action + '">Submit</button>'
        + '</form>';

    return form;
}

// Unfinished
// function getPinsByCategory(category) {
//     var url = "/api/pins/category/" + category;
//     var xhttpList = new XMLHttpRequest();
//     xhttpList.onreadystatechange = function () {

//         if (this.readyState == 4 && this.status == 200) {
//             sessionStorage.setItem("pinsbycategory", this.responseText);
//         }
//     };
//     xhttpList.open("GET", url, false);
//     xhttpList.send();
//     console.log("Pins by category retrieved");

//     return sessionStorage.getItem("pinsbycategory");

    // for (var index = 0; index < json.length; index++) {
    //     // We write our HTML in a string and use the insertAdjacentHTML(placement, string) where we pass the string to be rendered on our page
    // var dropdownHtml =  '<ul class="nav navbar-expand-sm bg-dark navbar-dark">' +
    //                 + '<li class="nav-item">'
    //                 +  '<a class="nav-link active" href="index.html">Home</a>'
    //                 + '</li>'
    //                 + '<li class="nav-item">'
    //                 + '<a class="nav-link active" href="index1.html">Board</a>'
    //                 + '</li>'
    //                 + '<li class="nav-item dropdown">'
    //                 + '<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#"> Categories</a>'
    //                 + '<div class="dropdown-menu" id="dropdown">'
    //                 + '<a class="dropdown-item" href="">Category1</a>'
    //                 + '<a class="dropdown-item" href="#">Category2</a>'
    //                 + '<a class="dropdown-item" href="#">Category3</a>'
    //                 + '</div>'
    //                 + '</li>'
    //                 + '</ul>';
        
    //     var cardHtml = 
    //         '<div class="card crd--effect-3 border-0" style="max-width:350px" id="' + json[index].id + '">'
    //             + '<div class="crd-img container">'
    //                 + '<img class="crd-img" style="width:100%; height:50%" src="' + json[index].imagePath + '">'
    //                     + '<h2 class=crd-heading" style="margin-bottom:0">' + '<span>' + json[index].title 
    //                         + '<div class="btn update-btn" id="update' + json[index].id + '">' + '</div>'
    //                     + '<button class="btn btn-light" style="color:lightgray" onclick="deletePin(' + json[index].id + ')">Delete</button>'
    //                     + '</h2>'
    //                     + '<span>'          
    //                     + '<div>' + '<p class="crd-text bottom-right">' + json[index].category + '</p>'
    //                     + '</div>'
    //                     + '<div>' + '<p class="crd-text">' + json[index].description + '</p>'
    //                     + '</div>'
    //             + '</div>'
    //         + '</div>';

    //         var display = document.getElementById("pins");
    //         display.innerHTML = '';
    //         getPins("/api/pins/category/" + id);

    //     console.log("Pin Card with ID: " + json[index].id + " 


    //     // We create a card deck that will dictate our groupings of cards
    //       var cardDeck;
    //     //  if (index % 5 == 0) {
    //          cardDeck = document.createElement("div");
    //          cardDeck.id = "deck" + index;
    //          document.getElementById("pins").appendChild(cardDeck);
    //          cardDeck = document.getElementById("deck" + index);
    //     // }

    //     document.getElementById("head").insertAdjacentHTML('beforeend', dropdownHtml);
    //     cardDeck.insertAdjacentHTML('beforeend', cardHtml);
    //     renderModal("updatePin", json[index].id);
// }

// Unfinished
// function renderPinsByCategory(url) {
//     // var json = getPinsByCategory(category);
//     var url = "/api/pins/categories/";
//     var xhttpList = new XMLHttpRequest();
//     xhttpList.onreadystatechange = function () {

//         if (this.readyState == 4 && this.status == 200) {
//             sessionStorage.setItem("pincategories", this.responseText);
//         }
//     };
//     xhttpList.open("GET", url, false);
//     xhttpList.send();
//     console.log("Categories of pins retrieved");

//     return sessionStorage.getItem("pincategories");

//     for (var index = 0; index < json.length; index++) {
//         // We write our HTML in a string and use the insertAdjacentHTML(placement, string) where we pass the string to be rendered on our page
//         var cardHtml = 
//             '<div class="card crd--effect-3 border-0" style="max-width:350px" id="' + json[index].id + '">'
//                 + '<div class="crd-img container">'
//                     + '<img class="crd-img" style="width:100%; height:50%" src="' + json[index].imagePath + '">'
//                         + '<h2 class=crd-heading" style="margin-bottom:0">' + '<span>' + json[index].title 
//                             + '<div class="btn update-btn" id="update' + json[index].id + '">' + '</div>'
//                         + '<button class="btn btn-light" style="color:lightgray" onclick="deletePin(' + json[index].id + ')">Delete</button>'
//                         + '</h2>'
//                         + '<span>'          
//                         + '<div>' + '<p class="crd-text bottom-right">' + json[index].category + '</p>'
//                         + '</div>'
//                         + '<div>' + '<p class="crd-text">' + json[index].description + '</p>'
//                         + '</div>'
//                 + '</div>'
//             + '</div>';

//         // We create a card deck that will dictate our groupings of cards
//           var cardDeck;
//         //  if (index % 5 == 0) {
//              cardDeck = document.createElement("div");
//              cardDeck.id = "deck" + index;
//              document.getElementById("pins").appendChild(cardDeck);
//              cardDeck = document.getElementById("deck" + index);
//         // }
//         cardDeck.insertAdjacentHTML('beforeend', cardHtml);
//     }
// }