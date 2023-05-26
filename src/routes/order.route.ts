import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { getAll, getByIdentifier } from '../controller/order.controller';

const route = Router();

// Rutas
route.get('/:date', verifyToken, getAll);
route.get('/list/:numberDocument', verifyToken, getByIdentifier);

export default route;
