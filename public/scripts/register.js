import {auth} from "./auth.js";


const email_input = document.querySelector("#email-input");
const password_input = document.querySelector("#password-input");
const name_input = document.querySelector("#name-input");
const phone_input = document.querySelector("#phone-input");
const register_form = document.querySelector("form");
const select_type = document.querySelector("#select-type");
const register_err = document.querySelector("#register-err");

register_form.addEventListener('submit', e => {
    e.preventDefault();

    if(!register_form.checkValidity()) {
        register_form.reportValidity();
        return;
    }
    submit_form();
});

async function submit_form() {
    const data = {
        email: email_input.value || '',
        password: password_input.value || '',
        name: name_input.value || '',
        phone: phone_input.value || '',
        type: select_type.value || ''
        
    };
    register_err.textContent = '';
    try {
        await auth.register(data);
        window.location.replace("../index.html?registration=true");
    } catch(err) { 
        let message = err.message || 'Registration Failed';

        
        if(message.includes('validation failed:')) {
            //Remove the start of the error message
            message = message.split('validation failed: ')[1];
            //if there are multiple error messages, only take the first one
            message = message.split(',')[0];
            //finally, remove the start of the individual error message
            if(message.includes(': ')) message = message.split(': ')[1];
        }
        register_err.textContent = message;
    }
}