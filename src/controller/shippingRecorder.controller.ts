import { Request, Response } from 'express';
import {
  IShippingRecorder,
  IShippingRecorderCreate,
} from '../interfaces/shippingRecorder';
import IShippingRecorderModel from '../models/shippingRecorder.model';
import sendResponse from '../utils/sendResponse';

// Listar
export const getAll = async (req: Request, res: Response) => {
  try {
    // Listado de documentos obtenidos desde la db
    const items = await IShippingRecorderModel.find().populate({
      path: 'user',
      select: 'name lastName userName email role',
    });

    // Mandamos la respuesta con la data
    return sendResponse<IShippingRecorder[]>(res, 200, 'Success', items);
  } catch (error: any) {
    // Mandamos el error capturado
    return sendResponse(res, 500, error.message);
  }
};

// Listar por ID
export const getByIdentifier = async (req: Request, res: Response) => {
  try {
    // Extraemos el id de los parametros
    const { id } = req.params;

    // Documento obtenido por el id desde la db
    const item = await IShippingRecorderModel.findById(id);

    // Verificamos si encontró el documento
    if (!item) {
      return sendResponse(res, 404, 'Not Found');
    }

    // Mandamos la respuesta con la data
    sendResponse<IShippingRecorder>(res, 200, 'Success', item!);
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};

// Crear
export const create = async (req: Request, res: Response) => {
  try {
    // Data mandada desde el body
    const data: IShippingRecorderCreate = req.body;

    // Creamos un nuevo documento mandando la data
    // Y tambien nos devolvera el nuevo documento creado
    const newItem = await IShippingRecorderModel.create(data);

    // Mandamos la respuesta con la data del nuevo documento
    sendResponse<IShippingRecorder>(res, 201, 'Created', newItem);
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};

// Editar
export const update = async (req: Request, res: Response) => {
  try {
    // Extraemos el id de los parametros
    const { id } = req.params;

    // Documento obtenido por el id desde la db
    const item = await IShippingRecorderModel.findById(id);

    // Verificamos si encontró el documento
    if (!item) {
      return sendResponse(res, 404, 'Not Found');
    }

    // Actualizamos el documento
    await item.updateOne(req.body);

    // Mandamos la respuesta
    sendResponse(res, 200, 'Success');
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};

// Activar - Desactivar
export const updateState = async (req: Request, res: Response) => {
  try {
    // Extraemos el id de los parametros
    const { id } = req.params;

    // Estado mandado desde el body
    const { state }: IShippingRecorderCreate = req.body;

    // Documento obtenido por el id desde la db
    const item = await IShippingRecorderModel.findById(id);

    // Verificamos si encontró el documento
    if (!item) {
      return sendResponse(res, 404, 'Not Found');
    }

    // Actualizamos el estado
    await item.updateOne({ state: state });

    // Mandamos la respuestas
    sendResponse(res, 200, 'Success');
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};
