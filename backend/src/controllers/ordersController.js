import { CLIENT_RENEG_LIMIT } from 'node:tls';
import db from '../database.js'

export async function POSTcreateOrder(req, res) {
    try {
        const { name, phone_number, address, payment_method, cart } = req.body; 
        const query = 'INSERT INTO clients (name, phone_number, address) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [name, phone_number, address]); 

        const novoClientId = result.insertId;

        const queryOrders = 'INSERT INTO orders ( client_id, payment_method, status) VALUES (?, ?, ?)';
        const [resultOrders] = await db.query(queryOrders, [novoClientId, payment_method, 'preparing']); 

        const newOrdersID = resultOrders.insertId; 

    for (const item of cart) {
            const queryItems = 'INSERT INTO orders_items (orders_id, product_name, quantity) VALUES (?, ?, ?)'; 
            await db.query(queryItems, [newOrdersID, item.product_id, item.quantity]);
        } 

        res.status(201).json ({
            success: true,
            message: "Cliente cadastrado com sucesso!",
            clientId: result.insertId            
        });
    
    } catch(error) {
        res.status(500).json ({
            success: false,
            message: error.message
        });
    }
}

