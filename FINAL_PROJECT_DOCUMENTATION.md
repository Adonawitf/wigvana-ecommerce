# WigVana - E-commerce Platform for Wigs
**MERN Stack Project Documentation**

## 1. Project Title
**WigVana**

## 2. Group Members
<!-- Please add your group members' names and IDs here -->
<!-- Example:
1. Student Name (ID)
2. Student Name (ID)
3. Student Name (ID)
-->

## 3. Problem Statement
The wig and hair extension market in Ethiopia suffers from fragmentation and lack of transparency. Customers often struggle to find diverse, high-quality products in one location, while independent sellers lack a dedicated platform to reach a wider audience. 
*   **Limited Access**: Buyers have to physically visit multiple shops to find specific styles.
*   **Pricing Opacity**: Prices are often negotiable and inconsistent.
*   **Market Reach**: Sellers are limited to their physical location.

## 4. Objectives
The main objective is to develop a robust web application using the MERN stack that connects wig sellers with buyers.
*   **Centralized Marketplace**: To create a single platform for diverse wig products.
*   **Seamless Buying Experience**: To implement a user-friendly shopping cart and checkout process.
*   **Seller Empowerment**: To provide tools for sellers to manage products and view orders.
*   **Transparent Pricing**: To ensure clear pricing models including platform fees.

## 5. Functional and Non-Functional Requirements

### Functional Requirements
*   **User Authentication**: Users (Buyers/Sellers) can register and login.
*   **Product Management**: Sellers can Add, Edit, and Delete products with images.
*   **Search & Filter**: Users can filter products by category, price, and color.
*   **Shopping Cart**: Buyers can add items, adjust quantities, and view totals.
*   **Checkout System**: A multi-step checkout collecting shipping info and simulating payment.
*   **Order Management**: Buyers can view history; Sellers can view and update order status.
*   **Admin Dashboard**: Administrators can oversee users and products.

### Non-Functional Requirements
*   **Usability**: The UI/UX is designed with Material-UI for a modern, responsive feel.
*   **Performance**: Optimized React components for fast page loads.
*   **Data Persistence**: (Currently using LocalStorage for prototype) ensuring data survives refreshes.
*   **Scalability**: The MERN architecture allows for future backend expansion.

## 6. System Architecture (MERN Stack Overview)
This project is designed based on the **MERN** stack architecture:
*   **MongoDB**: (Database) Documents for Users, Products, and Orders.
*   **Express.js**: (Backend Framework) REST API to handle requests.
*   **React.js**: (Frontend) Dynamic user interface for handling the presentation layer.
*   **Node.js**: (Runtime) Server-side environment.

*Note: The current prototype heavily focuses on the **React** frontend implementation with simulated backend logic and persistence via LocalStorage to demonstrate full CRUD functionality before backend deployment.*

## 7. System Features
*   **Dynamic Fee Calculation**: System automatically calculates a 5% platform fee for every order.
*   **Real-time Status Updates**: Sellers can mark orders as "Processing" or "Completed".
*   **Responsive Design**: Works on desktop and mobile devices.
*   **Secure Routing**: Protected routes ensure only authenticated users access specific pages.

## 8. Data Model (Schema Overview)

### User Schema
*   `id`: Unique Identifier
*   `name`: Full Name
*   `email`: Email Address
*   `role`: 'buyer', 'seller', or 'admin'
*   `storeName`: (For sellers) Name of the shop

### Product Schema
*   `id`: Unique Identifier
*   `name`: Product Name
*   `price`: Unit Price
*   `category`: Type (e.g., Natural, Synthetic)
*   `image`: Base64 encoded string or URL
*   `stock`: Quantity available
*   `sellerId`: Reference to User

### Order Schema
*   `id`: Order Reference (e.g., ORD-123)
*   `items`: Array of product details
*   `totalAmount`: Final cost including fees
*   `status`: 'processing', 'completed', 'cancelled'
*   `shippingDetails`: Address and Contact info

## 9. API Endpoints (Simulated)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all available products |
| `POST` | `/api/products` | Create a new product (Seller only) |
| `GET` | `/api/orders` | Fetch user's order history |
| `POST` | `/api/orders` | Place a new order |
| `PUT` | `/api/orders/:id` | Update order status (Seller only) |

## 10. Screenshots
<!-- Please add screenshots of your running application here -->

### Login Page
<!-- [Add Login Screenshot] -->

### Dashboard / Home
<!-- [Add Home Page Screenshot] -->

### CRUD Operations (Add Product)
<!-- [Add 'Add Product' Form Screenshot] -->

### Checkout & Orders
<!-- [Add Checkout or Order History Screenshot] -->

## 11. Conclusion & Recommendations
WigVana successfully demonstrates the core capabilities of a modern e-commerce platform. It solves the problem of market fragmentation by centralizing wig sales. 
*   **Conclusion**: The project meets the functional requirements of CRUD operations, authentication, and state management.
*   **Recommendations**: Future work should focus on integrating the physical MongoDB backend, adding real payment gateway integration (Stripe/Chapa), and implementing real-time notifications using WebSockets.
