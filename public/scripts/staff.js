import {auth} from "./auth.js";
import { api } from "./api.js";
import { cents_to_dollars } from "./helper.js";

if (!auth.isAuthenticated()) window.location.replace('../index.html');

const user = auth.getUser();
document.querySelector('#welcome-msg').innerHTML = `Welcome, ${user.name}!`;

const menuBtn = document.getElementById('menuBtn');
const mngCustBtn = document.getElementById('mngCustBtn');
const logoutBtn = document.getElementById('logoutBtn');

menuBtn.addEventListener("click", () => {
    window.location.href = ("../pages/menu.html");
});

mngCustBtn.addEventListener("click", () => {
    window.location.href = ("../pages/manageCustomers.html");
});

logoutBtn.addEventListener("click", ()=>{
    auth.logout();
    window.location.replace('../index.html');
});

let orders = [];


const no_order = document.querySelector("#no-order");

const menu_items = await api.getMenuItems();
const customers = await api.getCustomers();

const order_list = document.querySelector('#order-list');



function add_order_to_list(order) {
  const order_panel = document.createElement('li');
  order_panel.classList.add('menu-card');

  let item_names = [];
  for(const itemId of order.itemIds) {
    const item = menu_items.find(i=>i._id===itemId).name;
    item_names.push(item);
  }
  const cust = customers.find(i=>i._id===order.createdBy);
  let customer_name = cust ? cust.name : "Deleted Customer";
  order_panel.innerHTML = `
  <button class="menu-toggle" id="toggle${order._id}">
    <h3${order.status==="Canceled"?' class="strike"':''}>Order #${order.orderNum}</h3>
    <div class="price">${cents_to_dollars(order.totalCost)}</div>
  </button>
  <div class="order-details hidden">
    <p>Items: ${item_names.join(", ")}</p>
    <p>Customer Name: ${customer_name}</p>
    <p>Status:<select>
      <option ${order.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
      <option ${order.status === 'Completed' ? 'selected' : ''}>Completed</option>
      <option ${order.status === 'Canceled' ? 'selected' : ''}>Canceled</option>
    </select></p>

    <button class="confirm-btn">Delete Order</button>
  </div>
  `;

  const order_toggle = order_panel.querySelector(`.menu-toggle`);
  const order_details = order_panel.querySelector('.order-details');

  order_toggle.addEventListener('click', ()=>{
    if(!order_details.classList.contains('hidden')) {
            order_details.classList.add('hidden');
        } else {
            order_details.classList.remove('hidden');
        }
  });

  const cancel_btn = order_panel.querySelector('.confirm-btn');

  cancel_btn.addEventListener('click', async ()=>{
      try {
        await api.deleteOrder(order._id);
        await render_orders();
      } catch(err) {
        console.log(err.message);
      }
  });

  const status_select = order_panel.querySelector("select");
  const order_name = order_toggle.querySelector('h3');
  status_select.addEventListener('change', async ()=>{
    if(order_name.classList.contains('strike') && status_select.value !== 'Canceled') order_name.classList.remove('strike');
    else if(!order_name.classList.contains('strike') && status_select.value === 'Canceled') order_name.classList.add('strike');
    const data = {
      status : status_select.value || ''
    }
    try {
      await api.updateOrder(order._id,data);
    } catch(err) {
      console.log(err.message);
    }
  });

  order_list.appendChild(order_panel);
}


async function render_orders() {
    order_list.innerHTML = '';
    orders = await api.getOrders();
    orders = orders.filter(o=>o.baristaId===user.id);
    if(orders.length===0) no_order.innerHTML = 'You have not yet been assigned an order.';
    for(const order of orders) add_order_to_list(order);
}

await render_orders();