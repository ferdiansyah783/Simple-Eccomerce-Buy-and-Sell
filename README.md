# E-Commerce App

This is a simple e-commerce web application built using **React**, **Express.js**, **Knex.js** (for database management), and **MySQL**. The application allows users to browse products, add them to the cart, and proceed with the checkout and payment process. Admin users can manage products, view orders, and update product details.

## Admin page
![Product Screenshot](./Screenshot%202025-02-14%20152743.png)

## Customer page
![Product Screenshot](./Screenshot%202025-02-14%20152849.png)

## Features

- **User Authentication**: Allows users to register, login, and manage their profiles.
- **Product Management**: Admins can add, update, delete, and manage product categories.
- **Shopping Cart**: Users can add products to their cart, adjust quantities, and proceed to checkout.
- **Order Management**: Users can place orders, view order history, and track the status of their orders.
- **Payment Integration**: Users can select a payment method and complete their checkout process.

## Tech Stack

- **Frontend**:
  - React
  - Tailwind CSS
  - React Router

- **Backend**:
  - Node.js (Express.js)
  - Knex.js (SQL Query Builder)
  - JWT Authentication
  - MySQL

- **Database**: MySQL

## Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download MySQL](https://dev.mysql.com/downloads/installer/)
- **npm** or **yarn** - Package managers for Node.js (npm comes with Node.js by default)

## Setup

### 1. Clone the Repository

Clone this repository to your local machine using:

```bash
git clone https://github.com/your-username/ecommerce-app.git
```

### 2. Install Dependencies

Navigate to the project directory and run:

```bash
cd ecommerce-app

npm install
npm install -g knex

change the knexfile.js to your own mysql database
npx knex migrate:latest
npx knex seed:run
```

### 3. Start the Server

Run the server using:

```bash
npm run dev
```

### 4. Access the Application

```bash
# Admin credentials:
email: admin@example.com
password: password

# Customer credentials:
username: customer1@example.com
password: password

Open your web browser and navigate to [http://localhost:5173](http://localhost:5173).