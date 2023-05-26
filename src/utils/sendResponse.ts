import { Response } from 'express';
import IResponse from '../interfaces/response';

let response;

const sendResponse = <T>(
  res: Response,
  code: number,
  message?: string | unknown,
  data?: T
) => {
  switch (code) {
    // Todo bien : Success
    case 200:
      response = createResponse<T>(code, message, data);
      res.status(code).json(response);
      break;

    // Creado : Created
    case 201:
      response = createResponse<T>(code, message, data);
      res.status(code).json(response);
      break;

    // Mala petición : Bad Request
    case 400:
      response = createResponse<T>(code, message);
      res.status(code).json(response);
      break;

    // No autorizado : Unauthorized
    case 401:
      response = createResponse<T>(code, message);
      res.status(code).json(response);
      break;

    // Prohibido: Forbidden
    case 403:
      response = createResponse<T>(code, message);
      res.status(code).json(response);
      break;

    // No encontrado : Not Found
    case 404:
      response = createResponse<T>(code, message);
      res.status(code).json(response);
      break;

    // Error en el servidor : Internal server error
    case 500:
      response = createResponse<T>(code, message || 'Internal server error');
      res.status(code).json(response);
      break;

    default:
      response = createResponse(code, 'Internal server error');
      res.status(500).json(response);
      break;
  }
};

const createResponse = <T>(
  code: number,
  message: string | unknown,
  data?: T
): IResponse<T> => {
  return {
    code,
    message,
    data,
  };
};

export default sendResponse;
