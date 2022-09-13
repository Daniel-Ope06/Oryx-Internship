const firebaseConfig = {
    apiKey: "AIzaSyDZgtkDykuz1FoLGvd7k1pKR4uDSEphlTg",
    authDomain: "form-practice-ope.firebaseapp.com",
    databaseURL: "https://form-practice-ope-default-rtdb.firebaseio.com",
    projectId: "form-practice-ope",
    storageBucket: "form-practice-ope.appspot.com",
    messagingSenderId: "3336003755",
    appId: "1:3336003755:web:bcc1319268dacd655e17ee",
    measurementId: "G-9GXK0MBE2B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const registrationFormDB = firebase.database().ref("Registration-Form-Data/Users");

let userArray = []; // array of all users in the database

let tableNum = 1;
let table = document.getElementById("table");
let tableBody = document.getElementById("table-body");

function addPersonToTable(personData){
    let tableRow     = document.createElement("tr");
    let tableNumCol  = document.createElement("td");
    let firstNameCol = document.createElement("td");
    let lastNameCol  = document.createElement("td");
    let genderCol    = document.createElement("td");
    let emailCol     = document.createElement("td");
    let userNameCol  = document.createElement("td");
    let passwordCol  = document.createElement("td");
    let deleteCol    = document.createElement("td");

    tableNumCol.innerHTML  = tableNum++;
    firstNameCol.innerHTML = personData.firstName;
    lastNameCol.innerHTML  = personData.lastName;
    genderCol.innerHTML    = personData.gender;
    emailCol.innerHTML     = personData.email;
    userNameCol.innerHTML  = personData.userName;
    passwordCol.innerHTML  = personData.password;
    deleteCol.innerHTML    = "<button type='button' class='btn btn-outline-danger' data-bs-toggle='modal' data-bs-target='#exampleModal'>Delete</button>";

    tableRow.appendChild(tableNumCol);
    tableRow.appendChild(firstNameCol);
    tableRow.appendChild(lastNameCol);
    tableRow.appendChild(genderCol);
    tableRow.appendChild(emailCol);
    tableRow.appendChild(userNameCol);
    tableRow.appendChild(passwordCol);
    tableRow.appendChild(deleteCol);

    tableBody.appendChild(tableRow);
}

function addAllPersonData(ArrayOfPersons){
    tableNum = 1;
    ArrayOfPersons.forEach(element => {
        addPersonToTable(element);
    });
}

function getAllDataOnce(){
    userArray = [];
    registrationFormDB.once("value", (snapshot) =>{
        snapshot.forEach(element => {
            userArray.push(element.val());
        });
        addAllPersonData(userArray);
        console.log(snapshot.val());
        //console.log(userArray);
    });
}

window.onload = getAllDataOnce;

// Delete btn set up
table.addEventListener("click", deleteRow);
let delBtn = document.getElementById("delBtn");

function deleteRow(e){
    if (!e.target.classList.contains("btn-outline-danger")){
        return;
    }
    const delRow = e.target.closest('tr');

    let cols = delRow.childNodes;

    document.getElementById("firstName").innerHTML = `First Name : ${cols[1].innerHTML}`;
    document.getElementById("lastName").innerHTML  = `Last Name : ${cols[2].innerHTML}`;
    document.getElementById("gender").innerHTML    = `Gender : ${cols[3].innerHTML}`;
    document.getElementById("email").innerHTML     = `Email : ${cols[4].innerHTML}`;
    document.getElementById("userName").innerHTML  = `Username : ${cols[5].innerHTML}`;
    document.getElementById("password").innerHTML  = `Password : ${cols[6].innerHTML}`;

    delBtn.addEventListener("click", () =>{
        delRow.remove();
        firebase.database().ref("Registration-Form-Data/Users/"+cols[5].innerHTML).remove().then(
            function(){
                // Show alert
                alert("Deleted successfully");
                //reload page
                window.location.reload();
            }
        );

    })
}

