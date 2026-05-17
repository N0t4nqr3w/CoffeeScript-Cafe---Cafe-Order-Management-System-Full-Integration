import {auth} from "./auth.js";
import {api} from "./api.js";

if(!auth.isAuthenticated()) window.location.replace("../index.html");

const menu_list = document.querySelector("#menu-list");

let menu_items = await api.getMenuItems();

console.log(menu_items);