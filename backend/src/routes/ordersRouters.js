import express from "express";
import { POSTcreateOrder } from "../controllers/ordersController.js";

const router = express.Router();
router.post('/', POSTcreateOrder); 


export default router; 