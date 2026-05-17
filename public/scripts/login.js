import {auth} from "./auth.js";

window.addEventListener('pageshow', check_authenticated);

function check_authenticated() {
    if(auth.isAuthenticated()) {
    const data = auth.getUser();
    if(data !== null) {
            if(data.type=="Customer") window.location.replace("../pages/customer.html");
            else if(data.type=="Staff") window.location.replace("../pages/staff.html");
    } 
    }
}


const email_input = document.querySelector("#email-input");
const password_input = document.querySelector("#password-input");
const login_btn = document.querySelector("#login-btn");
const message = document.querySelector("#message");

const registered = new URLSearchParams(window.location.search).get('registration')==="true";
if(registered) {
    message.textContent = "Registration successful! Please login."
}

login_btn.addEventListener('click', e=> {
    e.preventDefault();
    submit_form();
})

async function submit_form() {
    const email = email_input.value || '';
    const password = password_input.value || '';
    try {
        const data = await auth.login(email,password);
        if(data !== null) {
            if(data.user.type=="Customer") window.location.replace("../pages/customer.html");
            else if(data.user.type=="Staff") window.location.replace("../pages/staff.html");
        }
    } catch(err) {
        message.textContent = err.message || '';
    }
}
