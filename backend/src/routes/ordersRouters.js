import { Router } from "express";
import express from "express";
import { POSTcreateOrder, PUTupdateOrderStatus } from "../controllers/ordersController.js";

const router = express.Router();
router.post('/orders', POSTcreateOrder);
router.put('/orders/:id', PUTupdateOrderStatus);


export default router; 