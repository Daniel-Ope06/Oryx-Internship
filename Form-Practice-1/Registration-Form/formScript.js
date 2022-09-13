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

// Initialize Firebases
firebase.initializeApp(firebaseConfig);
const registrationFormDB = firebase.database().ref("Registration-Form-Data/Users");

// HTML sreferences
let form = document.getElementById("registration-form");
let userNameError = document.getElementById("username-error");
let passwordError = document.getElementById("password-error");
let emailError = document.getElementById("email-error");

const user = new Object();

let userArray = []; // array of all users in the database
window.onload = getUserArray; // update array on window reload

// Functions
function createUserObject(){
    user.firstName = document.getElementById("first-name").value,
    user.lastName  = document.getElementById("last-name").value,
    user.userName  = document.getElementById("username").value.toLowerCase(),
    user.gender    = document.getElementById("gender").value,
    user.email     = document.getElementById("email").value,
    user.password  = document.getElementById("password").value
}

function writePersonData(newUser){
    registrationFormDB.child(newUser.userName.toLowerCase()).set(user);

    // Show alert
    document.querySelector(".alert").style.display = "block";
    // Remove alert
    setTimeout(() =>{
        document.querySelector(".alert").style.display = "none";
    }, 2000);

    // Clear values from input boxes
    form.reset();
}

function getUserArray(){
    registrationFormDB.on("value", (snapshot) =>{
        userArray = [];
        snapshot.forEach(element => {
            userArray.push(element.val());
        });
    });
    console.log(userArray);
}

function validateForm(newUser){
    let errors = 0;
    // Validate password
    let n = newUser.password.length ;
    if (n < 6 || n > 20){
        passwordError.innerText = "Password must be 6 to 20 characters";
        errors++;
    }
    else{
        passwordError.innerText = "";
    }

    // Validate username and email
    userArray.forEach(element =>{
        // check if username already exists
        if (newUser.userName.toLowerCase().localeCompare(element.userName.toLowerCase()) == 0){
            userNameError.innerText = "Username not available";
            errors++;
        }
        else{
            userNameError.innerText = "";
        }

        // check if email already exists
        if (newUser.email.localeCompare(element.email) == 0){
            emailError.innerText = "Email is used by another account";
            errors++;
        }
        else{
            emailError.innerText = "";
        }
    });

    if (errors == 0){
        return true;
    }
    return false;
}

function submitForm(e){
    e.preventDefault();
    getUserArray(); // update array on submissiono
    createUserObject();

    if (validateForm(user)){
        writePersonData(user);
    }
}

// Button event
form.addEventListener("submit", submitForm);