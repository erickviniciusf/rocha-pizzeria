# Rocha Pizzeria

A web-based digital menu for a small pizzeria, allowing customers to place orders directly through WhatsApp.

## About the Project

Small pizzerias often rely on informal order-taking via WhatsApp, which leads to miscommunication, missing information, and unformatted messages. This project solves that by providing a simple digital menu where customers can browse products, build their order, and submit it — sending a formatted message automatically to the owner's WhatsApp.

## User Profile

The end user is a customer of a small local pizzeria. They access the menu through a shared link, typically on a mobile device, with no account or login required. The business owner receives the order as a formatted WhatsApp message, ready to be processed.

## Features

- Browse a menu with pizzas and drinks
- Select items and quantities
- Provide name, address, phone number, and payment method
- Submit order and receive a confirmation screen
- Order is automatically sent to the owner's WhatsApp in a structured format

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT
- **WhatsApp Integration:** Z-API

## Project Structure

```
rocha-pizzeria/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── database.js
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/
└── schema.sql
```

## Database Schema

Four tables:

- **clients** — stores customer information for each order
- **products** — menu items with category, price, and description
- **orders** — each order placed, linked to a client
- **orders_items** — individual items within each order

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

1. Clone the repository
2. Create the database and run `schema.sql`
3. Configure the `.env` file inside the `backend/` folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=pizzeria_rocha
JWT_SECRET=your_secret
```

4. Install dependencies and start the server:

```bash
cd backend
npm install
node src/index.js
```

## Status

Currently in development. MVP in progress.
