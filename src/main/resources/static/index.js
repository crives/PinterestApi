// All javascript functions are located in this one file
// Please note that you can use multiple .js files in your own projects
// as long as you link them in your header.

// We use AJAX to do all of our API calls to link through our API and DB
// Cards are rendered dynamically for each of our tuples in or db table
// and we render modals dynamically to display our update and create forms.

// The initialize function is linked to our html body, using the onload attribute.
// This means that when the HTML body is loaded, the .initialize() function activates.
function initialize() {
    // This render Modal call create our button and modal for creating a student at page onload.
    renderModal("createPin", "modals");
    // Our get students function also does our rendering of all our cards, by calling the renderStudent() function.
    getPins("/api/pins");
}

// AJAX call and rendering using renderStudent() inside
function getPins(url) {

    //make initial api call to get Student list
    var xhttpList = new XMLHttpRequest();

    // Read JSON - and put in storage
    xhttpList.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            renderPin(this.responseText);
        }
    };
    xhttpList.open("GET", url, true);
    xhttpList.send();
    console.log("Pins stored");

}

// function getBoardPins(url) {

//     //make initial api call to get Student list
//     var xhttpList = new XMLHttpRequest();

//     // Read JSON - and put in storage
//     xhttpList.onreadystatechange = function () {

//         if (this.readyState == 4 && this.status == 200) {
//             renderPin(this.responseText);
//         }
//     };
//     xhttpList.open("GET", url, true);
//     xhttpList.send();
//     console.log("Pins stored");

// }

function getCategories() {

    var url = "/api/pins/categories"

    var xhttpList = new XMLHttpRequest();

    xhttpList.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            sessionStorage.setItem("categories", this.responseText);
        }
    };
    xhttpList.open("GET", url, false);
    xhttpList.send();
    console.log("Categories retrieved");

    return sessionStorage.getItem("categories");
}


// We need this single student AJAX call to get API data when we update the student
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

// function dropdown(id, category) {

//     var dropdownHtml =  '<ul class="nav navbar-expand-sm bg-dark navbar-dark">' +
//         + '<li class="nav-item">'
//          +  '<a class="nav-link active" href="index.html">Home</a>'
//         + '</li>'
//         + '<li class="nav-item">'
//          + '<a class="nav-link active" href="index1.html">Board</a>'
//        + '</li>'
//         + '<li class="nav-item dropdown">'
//          + '<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">Dropdown</a>'
//          + '<div class="dropdown-menu">'
//            + '<a class="dropdown-item" href="">Link 1</a>'
//            + '<a class="dropdown-item" href="#">Link 2</a>'
//            + '<a class="dropdown-item" href="#">Link 3</a>'
//          + '</div>'
//         + '</li>'
//       + '</ul>';
 
//      //  <!-- <nav class="navbar navbar-expand-sm bg-dark navbar-dark">
//      //         <ul class="navbar-nav">
//      //           <li class="nav-item active">
//      //             <a class="nav-link" href="index.html">Home</a>
//      //           </li>
//      //           <li class="nav-item active">
//      //             <a class="nav-link" href="index1.html">Board</a>
//      //           </li>
//      //         </ul>
//      //       </nav> -->
 
//      document.getElementById("head").insertAdjacentHTML('beforeend', dropdownHtml);
 
//  }

// This function renders all the students as we receive from our AJAX call
function renderPin(data) {
    var json = JSON.parse(data);

    // Ajax returns an array of JSON objects - the index represents each individual JSON object from our AJAX call
    // We can the iterate over all of our students
    for (var index = 0; index < json.length; index++) {
        // We write our HTML in a string and use the insertAdjacentHTML(placement, string) where we pass the string to be rendered on our page
        var cardHtml = '  <div class="card bg-primary"  style="width:300px; margin:20px" id="' + json[index].id + '">'
            + '<div class ="card-header"><h3 style="text-align:center">' + json[index].title + '</h3>'
            + '<img class="card-img-top" src=' + json[index].imagePath + ' alt="Pin Image" style="width:100%" height="170">'
            + '</div>'
            + '<div class="card-body text-center">'
            + '<p class="card-text">' + json[index].category + '</p>'
            + '<p class="card-text">' + json[index].description + '</p>'
            + '<button class="btn" id="update' + json[index].id + '">' + '</button>'
            + '<button class="btn btn-danger" onclick="deletePin(' + json[index].id + ')">Delete</button>'
            + '</div>'
            + '</div>'
            + '</div>';
        console.log("Pin Card with ID: " + json[index].id + " created");


        // We create a card deck that will dictate our groupings of cards
          var cardDeck;
        //  if (index % 4 == 0) {
             cardDeck = document.createElement("div");
            // cardDeck.classList.add("card-columns");
              cardDeck.id = "deck" + index;
              document.getElementById("pins").appendChild(cardDeck);
              cardDeck = document.getElementById("deck" + index);
    //   }

        cardDeck.insertAdjacentHTML('beforeend', cardHtml);
        // Once the student cards are created and rendered on our page, we can then find them and add on the update buttons with associated modals
        renderModal("updatePin", json[index].id);
    }

}

// This function renders the buttons and modals for our Create and Update students, and calls the renderForm() function that conatains the form data in
// a string version of HTML to be rendered.
function renderModal(modalPurpose, id) {

    var location;
    var color;
    var btntxt;
    var pin;
    var pinID = '';

    // Switch allows us to choose our format based on Create or Update
    switch (modalPurpose) {
        case "createPin":
            location = id;
            color = "btn-success";
            btntxt = "Create Pin";
            break;
        case "updatePin":
            pin = getOnePin(id);
            pinID = JSON.parse(pin).id;
            location = "update" + id;
            color = "btn-warning";
            btntxt = "Update";
            break;
    }

    // Button creation and placement - based on the Switch case above
    var buttonHtml = '<button type="button" class="btn ' + color + '" data-toggle="modal" data-target="#' + modalPurpose + pinID + '">' + btntxt + '</button>';
    document.getElementById(location).insertAdjacentHTML('beforeend', buttonHtml);


    // String that contains the HTML to render our modals
    // Note that Modals pair to buttons through the modal's id, and the button's data-target attributes. 
    var modalHtml = ' <div class="modal fade" id="' + modalPurpose + pinID + '"> '
        + ' <div class="modal-dialog modal-xl"> '
        + ' <div class="modal-content"> '

        + '<div class="modal-header">'
        + '<h4 class="modal-title">Modal Heading</h4>'
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

    // var sendData = {
    //     "id": id,
    //     "title": document.getElementById("addPintitle"+id).value,
    //     "imagePath": document.getElementById("addPinimagePath"+id).value,
    //     "category": document.getElementById("addPincategory"+id).value,
    //     "description": document.getElementById("addPindescription"+id).value
    // }
    // console.log(sendData);

    // var ok = confirm("Would you like to add this Pin to your board?");

    // // Just like create, we set our headers to show our data is JSON
    // if (ok == true) {
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open("POST", "/api/pins/add", true);
    //     xhttp.setRequestHeader('content-Type', 'application/json');
    //     xhttp.onreadystatechange = function () {
    //         if (this.readyState == 4 && this.status == 200) {
    //             console.log("Add success");
    //             var display = document.getElementById("pins");
    //             display.innerHTML = '';
    //             getBoardPins("/api/pins");
    //             console.log("Pin added!");
    //         }
    //     };
    //     // Be sure that the JSON student is coverted to String before sending, using JSON.stringify
    //     xhttp.send(JSON.stringify(sendData));
    // }
}
}


// AJAX create student
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

// In this AJAX update, we get all the data for one student as well.  This way we don't have to use PATCH verb
// When we get the single student data, we can use it to prefill the form with old data of that student.
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
        // + '<div class="input-group mb-3">'
        // + '<div class="input-group-prepend">'
        // + '<span class="input-group-text">Last Name</span>'
        // + '</div>'
        // + '<input type="text" class="form-control" placeholder="Enter First Name" id="' + purpose + 'LastName' + id +'" value="' + lastName + '">'
        // + '</div>'
        // + '<div class="input-group mb-3">'
        // + '<div class="input-group-prepend">'
        // + '<span class="input-group-text">email</span>'
        // + '</div>'
        // + '<input type="text" class="form-control" placeholder="Enter First Name" id="' + purpose + 'email' + id +'" value="' + email + '">'
        // + '</div>'
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