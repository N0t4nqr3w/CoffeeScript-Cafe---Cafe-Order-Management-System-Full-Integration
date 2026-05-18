import { auth } from "./auth.js";
import { api } from "./api.js";
import { cents_to_dollars } from "./helper.js";
 
if (!auth.isAuthenticated()) window.location.replace("../index.html");
const user = auth.getUser();
if (user.type !== "Staff") window.location.replace("../pages/customer.html");
 
document.querySelector("#return-btn").addEventListener("click", () => {
    window.location.replace("../pages/staff.html");
});
 
const orders_list = document.querySelector("#orders-list");
const filter_btn = document.querySelector("#filter-btn");
const filter_status = document.querySelector("#filter-status");
const filter_sort = document.querySelector("#filter-sort");
const orders_message = document.querySelector("#orders-message");
 
filter_btn.addEventListener("click", render_orders);
 
async function render_orders() {
    orders_list.innerHTML = "";
    const params = new URLSearchParams();
    if (filter_sort.value) params.append("sort", filter_sort.value);
 
    const orders = await api.getOrders(`?${params.toString()}`);
 
    const filtered = filter_status.value
        ? orders.filter(o => o.status === filter_status.value)
        : orders;
 
    if (filtered.length === 0) {
        orders_message.textContent = "No orders found.";
        return;
    }
    orders_message.textContent = "";
 
    for (const order of filtered) {
        add_order_to_list(order);
    }
}
 
function add_order_to_list(order) {
    const li = document.createElement("li");
    li.classList.add("order-card");
 
    let item_names = [];
    for(const itemId of order.itemIds) {
        const item = menu_items.find(i=>i._id===itemId).name;
        item_names.push(item);
    }

    let barista_name = baristas.find(i=>i._id===order.baristaId).name;

    const statusClass = order.status === "Completed"
        ? "status-completed"
        : order.status === "Canceled"
        ? "status-canceled"
        : "status-inprogress";
 
    li.innerHTML = `
        <button class="menu-toggle" id="toggle${order._id}">
            <h3>Order #${order.orderNum}</h3>
            <div class="price">${cents_to_dollars(order.totalCost)}</div>
        </button>
        <div class="order-details hidden">
            <p>Items: ${item_names.join(", ")}</p>
            <p>Barista Name: ${barista_name}</p>
            <p>Customer Name: ${order.createdBy}</p>
            <div class="status-controls">
                <label>Update Status:</label>
                <select id="status-select-${order._id}">
                    <option ${order.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option ${order.status === "Completed" ? "selected" : ""}>Completed</option>
                    <option ${order.status === "Canceled" ? "selected" : ""}>Canceled</option>
                </select>
                <button class="confirm-btn update-btn" id="update-${order._id}">Update</button>
            </div>
            <button class="confirm-btn delete-btn" id="delete-${order._id}">Delete Order</button>
            <p class="order-err" id="err-${order._id}"></p>
        </div>
    `;
 
    // Toggle order details
    li.querySelector(".order-header").addEventListener("click", () => {
        li.querySelector(`#details-${order._id}`).classList.toggle("hidden");
    });
 
    // Update order status
    li.querySelector(`#update-${order._id}`).addEventListener("click", async () => {
        const newStatus = li.querySelector(`#status-select-${order._id}`).value;
        const err = li.querySelector(`#err-${order._id}`);
        err.textContent = "";
        try {
            await api.updateOrder(order._id, { status: newStatus });
            await render_orders();
        } catch (e) {
            err.textContent = e.message || "Update failed.";
        }
    });
 
    // Delete order when completed
    li.querySelector(`#delete-${order._id}`).addEventListener("click", async () => {
        const err = li.querySelector(`#err-${order._id}`);
        err.textContent = "";
        try {
            await api.deleteOrder(order._id);
            li.remove();
        } catch (e) {
            err.textContent = e.message || "Delete failed.";
        }
    });
 
    orders_list.appendChild(li);
}
 
await render_orders();