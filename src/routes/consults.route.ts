import { Router } from 'express';
import { verifyToken } from '../middlewares/auth';
import { getAll } from '../controller/consults.controller';

const route = Router();

// Rutas
route.get('/', verifyToken, getAll);

export default route;
