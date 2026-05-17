import {auth} from "./auth.js";

document.querySelector("#menuBtn").addEventListener("click", () => {
    window.location.href = ("../pages/menu.html");
});

document.querySelector("#mngCustBtn").addEventListener("click", () => {
    window.location.href = ("../pages/manageCustomers.html");
});

document.querySelector("#logoutBtn").addEventListener("click", ()=>{
    auth.logout();
    window.location.replace('../index.html');
});


const app = {
  elements: {
    menuBtn: document.getElementById('menuBtn'),
    mngOrdersBtn: document.getElementById('mngOrdersBtn'),
    mngCustBtn: document.getElementById('mngCustBtn'),
    logoutBtn: document.getElementById('logoutBtn')
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

    this.elements.mngOrdersBtn.addEventListener('click', () => {
        window.location.href = ("");
    });

    this.elements.mngCustBtn.addEventListener('click', () => {
        window.location.href = ("");
    })

    this.elements.logoutBtn.addEventListener('click', () => {
      auth.logout();
      window.location.replace('../index.html');
    });
  },
  
};

document.addEventListener('DOMContentLoaded', () => app.init());