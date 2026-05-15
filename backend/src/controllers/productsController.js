import db from '../database.js'

export async function getAllProducts(req, res) {
    try {
        const products = await db.query('SELECT * FROM products'); 
        res.status(200).json ({
            success: true,
            data: products,
            message: "Aqui está a lista de todos os produtos"
        });
    } catch(error) {
    res.status(500).json ({
        sucess: false,
        message: "Erro ao buscar produtos"
    });
  }
}

