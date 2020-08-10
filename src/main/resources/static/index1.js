function initialize() {

    renderModal("createPin", "modals");
    // renderModal("updatePin", "modals");
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

// Working On
function getCategories() {

    var display = document.getElementById("categories");
    display.innerHTML = '';
    getRestaurants("/api/restaurants/delivery");
}


function getOnePin(id) {
    var url = "/api/pins/" + id;
    //make initial api call to get Student list
    var xhttpList = new XMLHttpRequest();
    var pin;

    // Read JSON - and put in storage
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

function renderManyPins(data) {

    var jsonArray = JSON.parse(data);


}

// This function renders all pins as we receive from our AJAX call
function renderPin(data) {
    var json = JSON.parse(data);

    for (var index = 0; index < json.length; index++) {
        // We write our HTML in a string and use the insertAdjacentHTML(placement, string) where we pass the string to be rendered on our page
        var cardHtml = 
            '<div class="card crd--effect-3 border-0" style="max-width:350px" id="' + json[index].id + '">'
                + '<div class="crd-img container">'
                    + '<img class="crd-img" style="width:100%; height:50%" src="' + json[index].imagePath + '">'
                        + '<h2 class=crd-heading" style="margin-bottom:0">' + '<span>' + json[index].title 
                            + '<div class="btn update-btn" id="update' + json[index].id + '">' + '</div>'
                        + '<button class="btn btn-light" style="color:lightgray" onclick="deletePin(' + json[index].id + ')">Delete</button>'
                        + '</h2>'
                        + '<span>'          
                        + '<div>' + '<p class="crd-text bottom-right">' + json[index].category + '</p>'
                        + '</div>'
                        + '<div>' + '<p class="crd-text">' + json[index].description + '</p>'
                        + '</div>'
                + '</div>'
            + '</div>';

        console.log("Pin Card with ID: " + json[index].id + " created");


        // We create a card deck that will dictate our groupings of cards
          var cardDeck;
        //  if (index % 5 == 0) {
             cardDeck = document.createElement("div");
             cardDeck.id = "deck" + index;
             document.getElementById("pins").appendChild(cardDeck);
             cardDeck = document.getElementById("deck" + index);
        // }

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
            break;
        case "updatePin":
            pin = getOnePin(id);
            pinID = JSON.parse(pin).id;
            location = "update" + id;
            color = "btn-light";
            btntxt = "Update";
            title = 'Update Pin';
            style = 'color:lightgray'
            break;
    }

    var buttonHtml = '<button type="button" class="btn ' + color + '" style=" ' + style + '" data-toggle="modal" data-target="#' + modalPurpose + pinID + '">' + btntxt + '</button>';
    document.getElementById(location).insertAdjacentHTML('beforeend', buttonHtml);


    // String that contains the HTML to render our modals
    // Note that Modals pair to buttons through the modal's id, and the button's data-target attributes. 
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

    // Write the modal in the appropriate place.  All modals can be written to the same place on the page, as this does not affect display our function.
    document.getElementById("modals").insertAdjacentHTML('beforeend', modalHtml);

}

function addPin(id) {

    // var addHtml =
    // '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="' +  + '">Submit</button>';
    
     // We append the URL to have the id based on what is passed, for our API
     var link = "/api/add/pin/" + id;
     console.log("Loaded into add function");
 
     var ok = confirm("Are you sure you want to add?\nPress 'OK' to confirm, or 'cancel' to cancel");
     if (ok == true) {
 
         var xhttp = new XMLHttpRequest();
         xhttp.open("POST", link, true);
 
         xhttp.onreadystatechange = function () {
             if (this.readyState == 4 && this.status == 200) {
                 // The deletion from the database happens when this call is sent, however we also need to remove
                 // from the page.  We do that by grabbing the card by id (which is the same as the student id) and then navigate to its parent node.
                 // We can then from the parent node, call the removeChild() and say which card to remove.
                 var addCard = document.getElementById(id);
 
                 addCard.parentNode.appendChild(addCard);
                 console.log("Pin added.");
             }
         };
         // No data to be sent in body
         xhttp.send(null);
}
}

// Ensure you have the correct verb, URI, and headers set.  SendData is a JSON object that conatains our information from the create form
function createPin() {

    // We need the JSON that will be in our POST body.  We retrieve the data from the form and store in the values.
    var sendData = {
        "title": document.getElementById("createPintitle").value,
        "imagePath": document.getElementById("createPinimagePath").value,
        "category": document.getElementById("createPincategory").value,
        "description": document.getElementById("createPindescription").value
    }
    console.log(sendData);

    // Confirmation about creating
    var ok = confirm("Ready to send?");

    if (ok == true) {
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "/api/create/pin", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Update success");
                // We need to refresh the display to show our new student, so we clear the div with our current cards on 
                // display.  Then we call the function getStudents() to reload our cards.
                var display = document.getElementById("pins");
                display.innerHTML = '';
                getPins("/api/pins");
                console.log("Pin created!");
            }
        };
        // When we send our JSON student, we need to covert it to String using JSON.stringify.  The header is what lets our recipient know that it should
        // be read as JSON
        xhttp.send(JSON.stringify(sendData));
    }

}

// When we delete, we need the ID to grab that student and delete
function deletePin(id) {
    // We append the URL to have the id based on what is passed, for our API
    var link = "/api/delete/pin/" + id;
    console.log("Loaded into delete function");

    var ok = confirm("Are you sure you want to delete?\nPress 'OK' to confirm, or 'cancel' to cancel");
    if (ok == true) {

        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", link, true);

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // The deletion from the database happens when this call is sent, however we also need to remove
                // from the page.  We do that by grabbing the card by id (which is the same as the student id) and then navigate to its parent node.
                // We can then from the parent node, call the removeChild() and say which card to remove.
                var removeCard = document.getElementById(id);

                removeCard.parentNode.removeChild(removeCard);
                console.log("Pin deleted.");
            }
        };
        // No data to be sent in body
        xhttp.send(null);
    }
}

// In this AJAX update, we get all the data for one pin as well.  This way we don't have to use PATCH verb
// When we get the single pin data, we can use it to prefill the form with old data of that pin.
// If you try to update and leave things blank, it will override your old data to the blanks.
function updatePin(id) {

    // Just like in Create, we need to populate the JSON student that we will put in our AJAX body to submit to our API
    // We need the id this time, since we need to know which student we are updating.
    var sendData = {
        "id": id,
        "title": document.getElementById("updatePintitle"+id).value,
        "imagePath": document.getElementById("updatePinimagePath"+id).value,
        "category": document.getElementById("updatePincategory"+id).value,
        "description": document.getElementById("updatePindescription"+id).value
    }
    console.log(sendData);

    var ok = confirm("Please confirm you wish to apply these changes");

    // Just like create, we set our headers to show our data is JSON
    if (ok == true) {
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
        // Be sure that the JSON student is coverted to String before sending, using JSON.stringify
        xhttp.send(JSON.stringify(sendData));
    }
}

function renderDropdown() {

    document.getElementById("modals").insertAdjacentHTML('beforeend', modalHtml);


}

function dropdown(id, category) {

   var dropdownHtml =  '<ul class="nav navbar-expand-sm bg-dark navbar-dark">' +
       + '<li class="nav-item">'
        +  '<a class="nav-link active" href="index.html">Home</a>'
       + '</li>'
       + '<li class="nav-item">'
        + '<a class="nav-link active" href="index1.html">Board</a>'
      + '</li>'
       + '<li class="nav-item dropdown">'
        + '<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">Dropdown</a>'
        + '<div class="dropdown-menu" id="dropdown">'
          + '<a class="dropdown-item" href="">Link 1</a>'
          + '<a class="dropdown-item" href="#">Link 2</a>'
          + '<a class="dropdown-item" href="#">Link 3</a>'
        + '</div>'
       + '</li>'
     + '</ul>';

    document.getElementById("head").insertAdjacentHTML('beforeend', dropdownHtml);

}


// This function will return a form, based on creating or updating.  It returns a string of HTML which we pass to our modal to be rendered.
function pinForm(id, purpose) {
    // Initialize our variables that will put injected in the form.
    var input;
    var id;
    var title;
    var category;
    var imagePath;
    var description;
    var action;

    // Switch statement assigns variables based on create or update.  If update is selected, our variables are read from the single student JSON,
    // using the getOneStudent(id) method
    switch (purpose) {
        // case "addPin":
        //     input = JSON.parse(pin);
        //     id = JSON.parse(id);
        //     title = JSON.parse(title);
        //     category = JSON.parse(category);
        //     imagePath = JSON.parse(imagePath);
        //     description = JSON.parse(description);
        //     action= 'addPin()';
        //     break;
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

    // The actual HTML that will be returned (called later by the modal) stored in String form
    // The variables are set based on create or update.  The value attributes of the input elements are key to filling in the form with the existing
    // student data
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
        + '<button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="' + action + '">Submit</button>'
        + '</form>';

        // The HTML of the form above is a string, and can be called by other functions to be rendered where appropriate.
    return form;
}