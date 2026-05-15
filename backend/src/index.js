import 'dotenv/config'; 
import express from 'express'; 
import cors from 'cors'; 
import pool from './database.js'; 
import { getAllProducts } from './controllers/productsController.js';
import productsRouters from './routes/productsRouters.js'

const app = express();
const PORT = process.env.PORT || 3000
    
app.use(cors());
app.use(express.json());
app.use('/api/products', productsRouters);

app.get('/', (req, res) => {
    res.json({'Mensagem': 'API funcionando normalmente'})
})

async function conexaoComBD(){
    const resultado = await pool.query('SELECT 1')
    console.log("Banco conectado com sucesso")
} 

conexaoComBD().catch(err => {
    console.log('Erro ao conectar ao banco', err)
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})  