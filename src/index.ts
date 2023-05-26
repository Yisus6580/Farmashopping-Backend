import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import orderRecorderRoutes from './routes/orderRecorder.route';
import shippingRecorderRoutes from './routes/shippingRecorder.route';
import userRoutes from './routes/user.route';
import orderRoutes from './routes/order.route';
import { connect } from './database';
import helmet from 'helmet';

connect();
dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors({ origin: '*' }));

app.use('/api/order', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orderRecorder', orderRecorderRoutes);
app.use('/api/shippingRecorder', shippingRecorderRoutes);

app.listen(process.env.PORT, () => {
  console.log('Server on port', process.env.PORT);
});
