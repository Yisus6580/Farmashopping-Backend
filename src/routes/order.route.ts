import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { getAll } from '../controller/order.controller';

const route = Router();

// Rutas
route.get('/:date', verifyToken, getAll);

export default route;
