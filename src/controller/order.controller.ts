import axios from 'axios';
import { Request, Response } from 'express';
import { IOrder } from '../interfaces/consults';
import sendResponse from '../utils/sendResponse';

// Listar
export const getAll = async (req: Request, res: Response) => {
  const { date } = req.params;
  try {
    const items = await await axios.get(
      `http://omnidata.click:1356/api/FARMAREST/v1/ventas/0/list/${date}`
    );

    // Mandamos la respuesta con la data
    return sendResponse<IOrder[]>(res, 200, 'Success', items.data);
  } catch (error: any) {
    // Mandamos el error capturado
    return sendResponse(res, 500, error.message);
  }
};
