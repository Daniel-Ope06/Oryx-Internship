let registrationForm = document.getElementById("registration-form");
let loginForm = document.getElementById("login-form");
loginForm.style.left = "-450px";
registrationForm.style.left = "90px";

function signIn(){
    // Hide registration form
    registrationForm.style.left = "650px";
    // Show login form
    loginForm.style.left = "690px";
    // Clear registration form
    registrationForm.reset();
}

function signUp(){
    // Show registration form
    registrationForm.style.left = "90px"
    // Hide login form
    loginForm.style.left = "-450px";
    // Clear login form
    loginForm.reset();
}