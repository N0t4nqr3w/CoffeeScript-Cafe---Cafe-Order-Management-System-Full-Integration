# CoffeeScript-Cafe---Cafe-Order-Management-System-Full-Integration
By: Elijah Parkos, Carson Logelin, Benjamin Li, & Andrew Yang
## Brief description of your API domain.
This API is designed for a cafe order management system that handles customer interactions, menu management, and order processing. It allows users to:
1. Register and manage customers.
2. Register and manage barista accounts.
3. View and manage menu items.
4. Create and track orders.

## Team member names and primary responsibilities.
### Elijah Parkos
#### Project Setup
- Created main.js, .env, package.json, etc.
#### Login and Registration
- Created index.html and /pages/registration.html to handle user account creation and authentication.
- Also created security and authentication files, such as /routes/auth.js and /scripts/auth.js.
#### Menu Item Management
- Created /pages/menu.html to handle all CRUD operations for menu items.
- The page automatically updates depending on whether a customer or a staff member is logged in.
#### Page Styling
- Working off Benjamin's page style, created the css style for the rest of the pages.

### Carson Logelin
#### /pages/staff.html
- Created a page that features a staff dashboard allowing staff members to access pages which allow them to edit the menu, manage customers, manage orders, and logout.
#### /scripts/staff.js
- Created js file to add functionality to the staff page UI elements.
#### /pages/manageCustomers.html
- Created a page which displays a list of all customers and allows for customers to be edited or deleted.
#### /scripts/manageCustomers.js
- Created js file which gathers a list of customers and displays them. This file also adds event listeners to all buttons and the page, and it enables the user to edit or delete customers.

### Benjamin Li
#### /pages/orders.html
- Created an order page that display the menus for the customer can order from and place an order in the same page.
#### /scripts/menuDisplay.js
- Created to pull menu items to give option to order for the customers to add for their order and redirect to their dashboard after finishing their order.
#### /style/style.css
- style for the orders page

### Andrew Yang
#### /script/customer.js
- Created Customer Dashboard UI mechanics that lets the customer viewing menu items, creating orders, viewing orders, and logging out.
#### /pages/customer.html
- Created a page that will have Customer Dashboard UI mechanics that will let the customer interact with viewing menu items, creating orders, viewing orders, and logging out.
#### README.md
- Wrote most of the README.md file. 

## List of implemented functionalities.
- User account registration (both for customers and staff members)
- User login and authentication
- Passwords are encrypted before being stored in the database
- Customers can view and filter the menu
- Customers can start an order, then manage their current orders on the dashboard
- Staff can create, edit, and delete menu items
- Staff can view, filter, sort, edit, and delete customer accounts
- Staff can manage orders that have been assigned to them on their dashboard

## Server setup (how to start your server)
1. Clone the Repository
2. Ensure you have Node.js installed
3. Install Dependencies (run `npm install` in the project folder)
4. Replace .env.example with your own .env file
5. Finally, run `node main.js` to start the server
