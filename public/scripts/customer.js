import {auth} from './auth.js';

const app = {
  elements: {
    menuBtn: document.getElementById('menuBtn'),
    startOrderBtn: document.getElementById('startOrderBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
  },

  init() {
    console.log("Customer page loaded");
    if (!auth.isAuthenticated()) {
    window.location.replace('../index.html');
    return;
  }
    const customer = auth.getUser();
    document.querySelector('h1').innerHTML = `Welcome, ${customer.name} | CoffeeScript Caf&eacute;`;
    this.setupEventListeners();
  },

  setupEventListeners() {
    this.elements.menuBtn.addEventListener('click', () => {
        window.location.href = ("../pages/menu.html");
    });

    this.elements.startOrderBtn.addEventListener('click', () => {
        window.location.href = ("../pages/orders.html");
    });

    this.elements.logoutBtn.addEventListener('click', () => {
      auth.logout();
      window.location.replace('../index.html');
    });
  },
  
};

document.addEventListener('DOMContentLoaded', () => app.init());