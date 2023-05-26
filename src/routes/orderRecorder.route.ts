import { Router } from 'express';
import {
  create,
  getAll,
  getByIdentifier,
  update,
  updateState,
} from '../controller/orderRecorder.controller';
import { verifyToken } from '../middlewares/auth';

const route = Router();

// Rutas
route.get('/', verifyToken, getAll);
route.get('/list/:id', verifyToken, getByIdentifier);
route.post('/create', verifyToken, create);
route.put('/update/:id', verifyToken, update);
route.patch('/updateState/:id', verifyToken, updateState);

export default route;
