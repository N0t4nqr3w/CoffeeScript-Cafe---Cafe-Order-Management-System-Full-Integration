import {api} from "./api.js";
import { cents_to_dollars } from "./helper.js";
import { auth } from "./auth.js";


if(!auth.isAuthenticated()) window.location.replace("../index.html");
let user_type = auth.getUser().type;

const return_btn = document.querySelector('#return-btn');
return_btn.addEventListener('click', ()=>{
    if(user_type==="Customer") window.location.replace("../pages/customer.html");
    else if(user_type==="Staff") window.location.replace("../pages/staff.html");
    else window.location.replace("../index.html");
});

const options = await api.getMenuItems();

let cart = [];

function MenusDisplay() {
    const menuGrid = document.getElementById('menuGrid');

    for(const item of options) {
        const menu_card = document.createElement('div');
        menu_card.classList.add('menu-card');
        menu_card.innerHTML = `<div class = "menu-card">
            <h3>${item.name}</h3>
            <div class="price">${cents_to_dollars(item.price)}</div>
            <button class = "btn-add">Add to Cart</button>
        </div>`;

        const btn = menu_card.querySelector(`.btn-add`);
        btn.addEventListener('click', ()=>{
            addOrder(item._id);
        });

        menuGrid.appendChild(menu_card);
    }
    
}

function addOrder(id) {
    const choseItem = options.find(item => item._id === id);
    if (choseItem) {
        cart.push(choseItem);

    }
    cartUI();
}

const submitBtn = document.getElementById('submitBtn');
function cartUI() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    const hiddenInputsContainer = document.getElementById('hiddenInputsContainer');
    
    if (cart.length > 0) {
        if (submitBtn) {
            submitBtn.style.display = 'block';
        }
    }
    else {
        if (submitBtn) {
            submitBtn.style.display = 'none';
        }
    }



    cartItems.innerHTML = cart.map(item => `<div>${item.name}</div>`).join('');
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    totalPrice.textContent = `${cents_to_dollars(subtotal)}`;

}

submitBtn.addEventListener('click', place_order);
async function place_order() {
    const baristas = await api.getStaff();
    if(baristas.length === 0) {
        console.log("No baristas available.");
        return;
    }
    const barista = baristas[Math.floor(Math.random() * baristas.length)];

    const ids = cart.map(item => item._id);

    const price =  cart.reduce((sum, item) => sum + item.price, 0);;

    const userId = auth.getUser().id;

    const data = {
        baristaId: barista._id,
        itemIds: ids,
        totalCost: price,
        createdBy: userId
    };

    try {
        await api.createOrder(data);
        window.location.reload(); //TODO: Show the user some confirmation of their order (Maybe send them to a page where they can view their orders?)

    } catch(err) {
        console.log(err.message);
    }
}

MenusDisplay();