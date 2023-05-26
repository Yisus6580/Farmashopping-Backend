import { Router } from 'express';
import {
  create,
  getAll,
  getByIdentifier,
  login,
  recoveryPassword,
  sendEmail,
  update,
  updateState,
} from '../controller/user.controller';
import { verifyToken } from '../middlewares/auth';
import upload from '../middlewares/multer';

const route = Router();

// Rutas
route.get('/', verifyToken, getAll);
route.get('/list/:id', verifyToken, getByIdentifier);
route.patch('/updateState/:id', verifyToken, updateState);
route.post('/create', upload.single('image'), create);
route.put('/update/:id', verifyToken, upload.single('image'), update);
route.post('/login', login);
route.post('/sendEMail', sendEmail);
route.post('/recoveryPassword/:id/:token', recoveryPassword);

export default route;
