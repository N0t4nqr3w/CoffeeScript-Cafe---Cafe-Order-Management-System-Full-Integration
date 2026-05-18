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

//a unique identifier for cart items in this session
let cart_id = 0;

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
    const choseItem = options.find(i => i._id === id);

    const item = {
        cartItem: choseItem,
        uniqueId: cart_id++
    };

    if (item) {
        cart.push(item);

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

    cartItems.innerHTML='';
    let subtotal = 0;
    for(const item of cart) {
        const order_list_item = document.createElement('div');
        order_list_item.classList.add('order-list-item');
        order_list_item.innerHTML=`${item.cartItem.name}`;

        subtotal += item.cartItem.price;
        

        order_list_item.addEventListener('click', ()=>{
            cart = cart.filter(i=>i.uniqueId!==item.uniqueId);
            cartUI();
        });

        cartItems.appendChild(order_list_item);

    }

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

    const ids = cart.map(item => item.cartItem._id);

    const price =  cart.reduce((sum, item) => sum + item.cartItem.price, 0);;
    const userId = auth.getUser().id;

    const data = {
        baristaId: barista._id,
        itemIds: ids,
        totalCost: price,
        createdBy: userId
    };

    try {
        const orderId = await api.createOrder(data);

        window.location.href = `../pages/customer.html`;

    } catch(err) {
        console.log(err.message);
    }
}

MenusDisplay();