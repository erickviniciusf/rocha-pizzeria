import { CLIENT_RENEG_LIMIT } from 'node:tls';
import db from '../database.js'
import { stat } from 'node:fs';

export async function POSTcreateOrder(req, res) {
    try {
        const { name, phone_number, address, payment_method, obs, cart } = req.body; 
        const query = 'INSERT INTO clients (name, phone_number, address) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [name, phone_number, address]); 

        const novoClientId = result.insertId;

        const queryOrders = 'INSERT INTO orders (client_id, payment_method, status, obs) VALUES (?, ?, ?, ?)';
        const [resultOrders] = await db.query(queryOrders, [novoClientId, payment_method, 'preparing', obs || null]); 

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

// API QUE BUSCA O PEDIDO E DEVOLVE COM O STATUS ATUALIZADO 

export async function PUTupdateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "O campo status é obrigatorio."
            });
        }
            const query = 'UPDATE orders SET status = ? WHERE id = ?';
            const [result] = await db.query(query, [status, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Pedido não encontrado. "
                });
            }

            return res.status(200).json({
                success: true,
                message: `Status do pedido ${id} atualizado para '${status}' com sucesso!`
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

}