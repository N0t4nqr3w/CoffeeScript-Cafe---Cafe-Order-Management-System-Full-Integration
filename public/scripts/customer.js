import {auth} from './auth.js';

const app = {
  elements: {
    menuBtn: document.getElementById('menuBtn'),
    startOrderBtn: document.getElementById('startOrderBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
  },

  init() {
    if (!auth.isAuthenticated()) {
    window.location.replace('../index.html');
    return;
  }
    const user = auth.getUser();
    document.querySelector('#welcome-msg').innerHTML = `Welcome, ${user.name}!`;
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