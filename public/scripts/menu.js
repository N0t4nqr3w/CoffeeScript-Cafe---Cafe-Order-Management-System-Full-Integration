import {auth} from "./auth.js";
import {api} from "./api.js";
import { cents_to_dollars } from "./helper.js";

if(!auth.isAuthenticated()) window.location.replace("../index.html");

let user_type = auth.getUser().type;
let menu_items = await api.getMenuItems();

const menu_list = document.querySelector("#menu-list");
const add_btn = document.querySelector("#add-btn");
const new_item = document.querySelector("#new-item");
if(user_type==="Staff") add_btn.classList.remove("hidden");
const return_btn = document.querySelector("#return-btn");
const confirm_btn = document.querySelector("#confirm-btn");
const name_input = document.querySelector("#name-input");
const select_category = document.querySelector("#select-category");
const description_input = document.querySelector("#description-input");
const price_input = document.querySelector("#price-input");
const ingredient_input = document.querySelector("#ingredient-input");
const menu_err = document.querySelector("#menu-err");
const message = document.querySelector("#message");
const search_input = document.querySelector("#search-input");
const filter_category = document.querySelector("#filter-category");
const search_btn = document.querySelector("#search-btn");

let add_item_shown = false; 

add_btn.addEventListener('click', toggle_add_menu);

function toggle_add_menu() {
    message.textContent = '';
    if(add_item_shown) {
        add_item_shown = false;
        add_btn.textContent = "Add Menu Item";
        new_item.classList.add("hidden");
    } else {
        add_item_shown = true;
        add_btn.textContent = "Cancel";
        new_item.classList.remove("hidden");
    }
}


return_btn.addEventListener('click', ()=>{
    if(user_type==="Customer") window.location.replace("../pages/customer.html");
    else if(user_type==="Staff") window.location.replace("../pages/staff.html");
    else window.location.replace("../index.html");
});


confirm_btn.addEventListener('click', e=>{
    e.preventDefault();
    submit_form();
});

async function submit_form() {
    const data = {
        name: name_input.value || '',
        category: select_category.value || '',
        description: description_input.value || '',
        price: price_input.value || '',
        ingredients: ingredient_input.value.split(',').map(i=>i.trim().toLowerCase()) || []
    };
    menu_err.textContent = '';
    try {
        await api.createMenuItem(data);
        if(add_item_shown) toggle_add_menu();
        clear_add_fields();
        message.textContent = "Item successfully created!";
        await render_menu();

    } catch(err) {
        menu_err.textContent = err.message || '';
    }
}

function clear_add_fields() {
    name_input.value = '';
    select_category.value = 'Hot Drink';
    description_input.value = '';
    price_input.value = '';
    ingredient_input.value = '';
    message.textContent = '';
}

//create the html elements for showing a menu item on the page
async function add_item_to_list(item) {
    const item_panel = document.createElement('li');
    item_panel.classList.add('menu-card');

    item_panel.innerHTML = `
    <button class="menu-toggle" id="toggle${item._id}">
        <h3 ${item.inStock?'':'class="strike"'}>${item.name}</h3>
        <div class="price">${cents_to_dollars(item.price)}</div>
    </button>

    <div class="menu-details hidden" id="details${item._id}">
        <p>Category: ${item.category || 'None'}</p>
        <p>Description: ${item.description || 'None'}</p>
        <p>Ingredients: ${item.ingredients.join(', ') || 'None'}</p>
        <p>${item.inStock==true?"In Stock":"Out of Stock"}</p>

        <button class="confirm-btn ${user_type !=='Staff'?'hidden':''}" id='delete${item._id}'>Delete Item</button>
        <button class="confirm-btn ${user_type !=='Staff'?'hidden':''}" id='edit${item._id}'>Edit Item</button>
        
        <form class="hidden" id="edit-form${item._id}">
            <h3>Edit</h3>
            <fieldset>
                <label>Name</label>
                <input type="text" id="edit-name${item._id}" value="${item.name}"></input>
            </fieldset>
            <fieldset>
                <label>Category</label>
                <select id="edit-category${item._id}">
                    <option ${item.category === 'Hot Drink' ? 'selected' : ''}>Hot Drink</option>
                    <option ${item.category === 'Cold Drink' ? 'selected' : ''}>Cold Drink</option>
                    <option ${item.category === 'Hot Food' ? 'selected' : ''}>Hot Food</option>
                    <option ${item.category === 'Cold Food' ? 'selected' : ''}>Cold Food</option>
                    <option ${item.category === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </fieldset>
            <fieldset>
                <label>Description</label>
                <textarea id="edit-description${item._id}">${item.description}</textarea>
            </fieldset>
            <fieldset>
                <label>Price (in cents)</label>
                <input type="number" id="edit-price${item._id}" value="${item.price}"></input>
            </fieldset>
            <fieldset>
                <label>Ingredients (separate items by comma)</label>
                <input type="text" id="edit-ingredients${item._id}" value="${item.ingredients.join(', ')}"></input>
            </fieldset>
            <fieldset>
                <label>Stock</label>
                <select id="edit-stock${item._id}">
                    <option ${item.inStock == true ? 'selected' : ''}>In Stock</option>
                    <option ${item.inStock == false ? 'selected' : ''}>Out of Stock</option>
                </select>
            </fieldset>
            <p id="err${item._id}"></p>
            <input type="submit" value="Confirm Edit" class="confirm-btn confirm-edit" id="confirm-edit${item._id}">
        </form>
    </div>
    `
    const item_toggle = item_panel.querySelector(`#toggle${item._id}`);
    const item_details = item_panel.querySelector(`#details${item._id}`);
    item_toggle.addEventListener('click', ()=> {
        if(!item_details.classList.contains('hidden')) {
            item_details.classList.add('hidden');
        } else {
            item_details.classList.remove('hidden');
        }
    });

    const delete_btn = item_panel.querySelector(`#delete${item._id}`);
    delete_btn.addEventListener('click', async e => {
        e.preventDefault();
        item_panel.remove();
        await api.deleteMenuItem(item._id);
        await render_menu();
    });

    const edit_btn = item_panel.querySelector(`#edit${item._id}`);
    const edit_form = item_panel.querySelector(`#edit-form${item._id}`);
    edit_btn.addEventListener('click', async e => {
        e.preventDefault();
        if(!edit_form.classList.contains('hidden')) {
            edit_form.classList.add('hidden');
            edit_btn.textContent = 'Edit Item';
        } else {
            edit_form.classList.remove('hidden');
            edit_btn.textContent = 'Cancel Edit';
        }
    });

    const confirm_edit = item_panel.querySelector(`#confirm-edit${item._id}`);
    confirm_edit.addEventListener('click', async e =>{
        e.preventDefault();

        const data = {
        name: item_panel.querySelector(`#edit-name${item._id}`).value || '',
        category: item_panel.querySelector(`#edit-category${item._id}`).value || '',
        description: item_panel.querySelector(`#edit-description${item._id}`).value || '',
        price: item_panel.querySelector(`#edit-price${item._id}`).value || '',
        ingredients: item_panel.querySelector(`#edit-ingredients${item._id}`).value.split(',').map(i=>i.trim().toLowerCase()) || [],
        inStock: item_panel.querySelector(`#edit-stock${item._id}`).value==='In Stock',
    };
    const edit_err = item_panel.querySelector(`#err${item._id}`);
    edit_err.textContent = '';
    try {
        await api.updateMenuItem(item._id,data);
        await render_menu();

    } catch(err) {
        menu_err.textContent = err.message || '';
    }


    });

    menu_list.appendChild(item_panel);
}

//get search and filter data
search_btn.addEventListener('click', async()=>{
    const params = new URLSearchParams();

    if (search_input.value.trim()) {
        params.append('search', search_input.value.trim());
    }

    if (filter_category.value) {
        params.append('category', filter_category.value);
    }

    await render_menu(`?${params.toString()}`);
});

//get menu items from api with the given query and then render them
async function render_menu(query='') {
    menu_list.innerHTML = '';
    menu_items = await api.getMenuItems(query);
    for(const item of menu_items) add_item_to_list(item);
}

await render_menu();