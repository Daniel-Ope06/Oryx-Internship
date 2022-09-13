const firebaseConfig = {
    apiKey: "AIzaSyDR6hayb4DDfG9L_CqeQY_bQEKX07Cru1A",
    authDomain: "form-practice-2.firebaseapp.com",
    databaseURL: "https://form-practice-2-default-rtdb.firebaseio.com/",
    projectId: "form-practice-2",
    storageBucket: "form-practice-2.appspot.com",
    messagingSenderId: "560518948778",
    appId: "1:560518948778:web:5fe3d8a54890e6783e2dd3",
    measurementId: "G-BQFGVBBC4Q"
};

// Initialize Firebases
firebase.initializeApp(firebaseConfig);
const registrationFormDB = firebase.database().ref("Sign-Up-Form-Data/Users");
const authForm = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
const googleLoginBtn = document.getElementById("google-login");

// HTML sreferences
let registrationForm = document.getElementById("registration-form");
let loginForm = document.getElementById("login-form");

let userNameError = document.getElementById("username-error");
let passwordError = document.getElementById("password-error");
let emailError = document.getElementById("email-error");

let registrationAlert = document.getElementById("registration-alert");
let loginAlert = document.getElementById("login-alert");

const user = new Object();

let userArray = []; // array of all users in the database
window.onload = getUserArray; // update array on window reload

// Functions
function createUserObject(){
    user.userName  = document.getElementById("username").value.toLowerCase(),
    user.email     = document.getElementById("email").value,
    user.password  = document.getElementById("password").value
}

function writePersonData(newUser){
    registrationFormDB.child(newUser.email.substring(0, newUser.email.length-4)).set(user);

    // Store in firebase auth
    authForm.createUserWithEmailAndPassword(newUser.email, newUser.password)
        .then((userCredential) => {
            var user = userCredential.user;
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });


    // Show alert
    registrationAlert.style.display = "block";
    // Remove alert
    setTimeout(() =>{
        registrationAlert.style.display = "none";
    }, 2000);

    // Clear values from input boxes
    registrationForm.reset();
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

function submitRegistrationForm(e){
    e.preventDefault();
    getUserArray(); // update array on submissiono
    createUserObject();

    if (validateForm(user)){
        writePersonData(user);
    }
}

function submitLoginForm(e){
    e.preventDefault();

    let email = document.getElementById("email-login").value;
    let password = document.getElementById("password-login").value;

    authForm.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            let updateUserID = new Object();
            authForm.onAuthStateChanged((user) => {
                if (user) {
                  // User logged in already or has just logged in.
                  console.log(user.uid);
                  let updateUserID = {userID : user.uid};
                  firebase.database().ref("Sign-Up-Form-Data/Users/"+email.substring(0, email.length-4)).update(updateUserID);
                }
            });
            //updateUserID["UserID"] = user;
            
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            // Show alert
            loginAlert.style.display = "block";
            // Remove alert
            setTimeout(() =>{
                loginAlert.style.display = "none";
            }, 2000);
        });
}

function googleLogin(e){
    authForm.signInWithPopup(googleProvider)
        .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        var credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        console.log("google login");
        }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        });
}

// Button events
registrationForm.addEventListener("submit", submitRegistrationForm);
loginForm.addEventListener("submit", submitLoginForm);
googleLoginBtn.addEventListener("click", googleLogin);