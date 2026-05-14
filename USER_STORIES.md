# USER STORIES - Rocha Pizzeria

## SCENARIO 01 - Client views the menu

**USER:** Client
**ACTION:** View all available pizzas
**ROUTE:** GET /api/products
**RESPONSE:** List of pizzas with [id, name, category, price, description, image_url]

---

## SCENARIO 02 - Client places an order

**USER:** Client
**ACTION:** Create a new order with products
**ROUTE:** POST /api/orders
**INPUT:** { client_id, products: [{product_id, quantity}], payment_method }
**RESPONSE:** Success message with order ID

---

## SCENARIO 03 - Client tracks the order

**USER:** Client
**ACTION:** View details of their order
**ROUTE:** GET /api/orders/:id
**RESPONSE:** Order details + current status

---

## SCENARIO 04 - Client cancels the order

**USER:** Client
**ACTION:** Cancel an order
**ROUTE:** DELETE /api/orders/:id
**RESPONSE:** Cancellation confirmation

---