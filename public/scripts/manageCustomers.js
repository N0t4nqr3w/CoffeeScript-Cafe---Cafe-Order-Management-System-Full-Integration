import {auth} from "./auth.js";
import {api} from "./api.js";
import { cents_to_dollars, date_format } from "./helper.js";

if(!auth.isAuthenticated()) window.location.replace("../index.html");

let user_type = auth.getUser().type;
let customers = await api.getCustomers();

const customers_list = document.querySelector("#customers-list");
const return_btn = document.querySelector("#return-btn");

const search_input = document.querySelector("#search-input");
const sort_category = document.querySelector("#sort-category");
const search_btn = document.querySelector("#search-btn");

return_btn.addEventListener('click', ()=>{
    if(user_type==="Customer") window.location.replace("../pages/customer.html");
    else if(user_type==="Staff") window.location.replace("../pages/staff.html");
    else window.location.replace("../index.html");
});

async function add_customer_to_list(customer) {
    const customer_panel = document.createElement('li');
    customer_panel.classList.add('menu-card');

    customer_panel.innerHTML = `
    <button class="menu-toggle" id="toggle${customer._id}">
        <h3 ${customer.active?'':'class="strike"'}>${customer.name}</h3>
        <div class="price">${customer.email}</div>
    </button>

    <div class="menu-details hidden" id="details${customer._id}">
        <p>Phone Number: ${customer.phone || 'None'}</p>
        <p>Status: <select>
            <option ${customer.active ? 'selected' : ''}>Active</option>
            <option ${!customer.active ? 'selected' : ''}>Inactive</option>
        </select></p>
        <p>Creation Date: ${date_format(customer.createdDate) || 'None'}</p>

        <button class="confirm-btn ${user_type !=='Staff'?'hidden':''}" id='delete${customer._id}'>Delete</button>
    </div>
    `;
    const customer_toggle = customer_panel.querySelector(`#toggle${customer._id}`);
    const customer_details = customer_panel.querySelector(`#details${customer._id}`);
    customer_toggle.addEventListener('click', ()=> {
        if(!customer_details.classList.contains('hidden')) {
            customer_details.classList.add('hidden');
        } else {
            customer_details.classList.remove('hidden');
        }
    });

    const delete_btn = customer_panel.querySelector(`#delete${customer._id}`);
    delete_btn.addEventListener('click', async e => {
        e.preventDefault();
        try{
            await api.deleteUser(customer._id);
            await render_customers();
        } catch(err) {
            console.log(err.message);
        }
    });

    const status_select = customer_panel.querySelector("select");
    const customer_name = customer_toggle.querySelector('h3');
    status_select.addEventListener('change', async ()=>{
        if(customer_name.classList.contains('strike') && status_select.value === 'Active') customer_name.classList.remove('strike');
        else if(!customer_name.classList.contains('strike') && status_select.value === 'Inactive') customer_name.classList.add('strike');
        const data = {
            active : status_select.value==="Active"
        }
        try {
            await api.updateUser(customer._id,data);
        } catch(err) {
            console.log(err.message);
        }
  });

    customers_list.appendChild(customer_panel);
}

//get search and filter data
search_btn.addEventListener('click', async()=>{
    const params = new URLSearchParams({type:'customer'});

    if (search_input.value.trim()) {
        params.append('search', search_input.value.trim());
    }

    if (sort_category.value) {
        params.append('sort', sort_category.value.toLowerCase());
    }

    await render_customers(`?${params.toString()}`);
});

async function render_customers(query='?type=customer') {
    customers_list.innerHTML = '';
    customers = await api.getUsers(query);
    for(const c of customers) add_customer_to_list(c);
}

await render_customers();