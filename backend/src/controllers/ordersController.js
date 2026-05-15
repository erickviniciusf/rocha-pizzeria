import db from '../database.js'

export async function POSTcreateOrder(req, res) {
    try {
        const { name, phone_number, address } = req.body; 
        const query = 'INSERT INTO clients (name, phone_number, address) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [name, phone_number, address]); 

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