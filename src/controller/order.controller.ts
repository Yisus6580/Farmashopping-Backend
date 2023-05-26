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

// Listar
export const getByIdentifier = async (req: Request, res: Response) => {
  try {
    // Extraemos el id de los parametros
    const { numberDocument } = req.params;

    const item = await await axios.get(
      `http://omnidata.click:1356/api/FARMAREST/v1/ventas/0/${numberDocument}`
    );

    // Verificamos si encontró el documento
    if (!item) {
      return sendResponse(res, 404, 'Not Found');
    }

    // Mandamos la respuesta con la data
    sendResponse<IOrder>(res, 200, 'Success', item.data);
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};
