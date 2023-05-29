import axios from 'axios';
import { format } from 'date-fns';
import { Request, Response } from 'express';
import { IDataHome } from '../interfaces/consults';
import OrderRecorderModel from '../models/orderRecorder.model';
import ShippingRecorderModel from '../models/shippingRecorder.model';
import UserModel from '../models/user.model';
import sendResponse from '../utils/sendResponse';
import moment from 'moment-timezone';

// Listar
export const getAll = async (req: Request, res: Response) => {
  const date = moment().tz('America/La_Paz');
  const formattedDate = date.format('yyyy-MM-DD');
  console.log(formattedDate);

  try {
    // Extraemos el id de los parametros
    const orders = await await axios.get(
      `http://omnidata.click:1356/api/FARMAREST/v1/ventas/0/list/${formattedDate}`
    );

    const ordersRecorders = await OrderRecorderModel.find();

    const shippingRecorders = await ShippingRecorderModel.find();

    const users = await UserModel.find();

    // Mandamos la respuesta con la data
    return sendResponse<IDataHome>(res, 200, 'Success', {
      ordersToday: orders.data.length,
      totalNotesSalesRegisters: ordersRecorders.length,
      totalSendsRegisters: shippingRecorders.length,
      totalUsers: users.length,
    });
  } catch (error: any) {
    // Mandamos el error capturado
    return sendResponse(res, 500, error.message);
  }
};
