import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { IUser, IUserCreate, IUserEdit } from '../interfaces/user';
import UserModel from '../models/user.model';
import cloudinary from '../utils/cloudinary';
import sendResponse from '../utils/sendResponse';

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nonameggg000@gmail.com',
    pass: 'sgvrphhokatbdukd',
  },
});

// Listar
export const getAll = async (req: Request, res: Response) => {
  try {
    // Listado de documentos obtenidos desde la db
    const items = await UserModel.find();

    // Mandamos la respuesta con la data
    return sendResponse<IUser[]>(res, 200, 'Success', items);
  } catch (error: any) {
    // Mandamos el error capturado
    return sendResponse(res, 500, error.message);
  }
};

// Activar - Desactivar
export const updateState = async (req: Request, res: Response) => {
  try {
    // Extraemos el id de los parametros
    const { id } = req.params;

    // Estado mandado desde el body
    const { state }: IUserCreate = req.body;

    // Documento obtenido por el id desde la db
    const item = await UserModel.findById(id);

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

// Crear
export const create = async (req: Request, res: Response) => {
  // Data mandada desde el body
  const data: IUserCreate = req.body;

  try {
    // Verificamos que se suba una imagen
    if (req.file) {
      // Verificamos que el tamaño de la imagen no execeda el permitido // 3mb
      if (req.file.size > 1024 * 1024 * 3) {
        return sendResponse(res, 400, 'Bad Request Size');
      }

      // Verificamos que la extensión de la imagen sea valido
      if (
        req.file.mimetype !== 'image/jpeg' &&
        req.file.mimetype !== 'image/jpg' &&
        req.file.mimetype !== 'image/png'
      ) {
        return sendResponse(res, 400, 'Bad Request Format');
      }

      // Subir con Cloudinary
      await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: 'Farmashopping/Users/',
        },
        async (errors, result) => {
          // Verificamos si surgio algún error al subir la imagen
          if (errors) {
            return sendResponse(res, 400, 'Bad Request Upload Cloudinary');
          }

          // Asignamos la url de la imagen
          data.image = {
            publicId: result!.public_id,
            url: result!.secure_url,
          };
        }
      );
    }

    // Documento obtenido por el email desde la db
    const item = await UserModel.findOne({ email: data.email });

    // Verificamos si existe el documento
    if (item) {
      await deleteCloudinaryImage(res, data.image!.publicId);
      return sendResponse(res, 400, 'Bad Request');
    }

    // Encriptamos la contraseña
    data.password = await bcrypt.hash(data.password, 10);

    // Creamos un nuevo documento mandando la data
    // Y tambien nos devolvera el nuevo documento creado
    const newItem = await UserModel.create(data);

    // Creamos el token
    const token = jwt.sign({ _id: newItem._id }, process.env.SECRET_JWT!);

    // Mandamos la respuesta con la data del nuevo documento junto al token
    sendResponse<IUser>(res, 201, 'Created', {
      ...newItem.toObject(),
      password: undefined,
      token,
    });
  } catch (error: any) {
    // Eliminamos la imagen subida a Cloudinary en caso de haber salido mal la creación del item
    await deleteCloudinaryImage(res, data.image!.publicId);
    // Mandamos el error capturado
    sendResponse(res, 500, `${error.message}`);
  } finally {
    if (req.file) {
      await removeTemporalImage(res, req.file.path);
    }
  }
};

// Listar por ID
export const getByIdentifier = async (req: Request, res: Response) => {
  try {
    // Extraemos el id de los parametros
    const { id } = req.params;

    // Documento obtenido por el id desde la db
    const item = await UserModel.findById(id);

    // Verificamos si encontró el documento
    if (!item) {
      return sendResponse(res, 404, 'Not Found');
    }

    // Mandamos la respuesta con la data
    sendResponse<IUser>(res, 200, 'Success', item!);
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};

// Editar
export const update = async (req: Request, res: Response) => {
  // Data mandada desde el body
  const data: IUserEdit = req.body;

  // Extraemos el id de los parametros
  const { id } = req.params;

  // Documento obtenido por el id desde la db
  const item = await UserModel.findById(id);

  // Verificamos si encontró el documento
  if (!item) {
    return sendResponse(res, 404, 'Not Found');
  }

  try {
    // Verificamos que se suba una imagen
    if (req.file) {
      // Verificamos que el tamaño de la imagen no execeda el permitido // 3mb
      if (req.file.size > 1024 * 1024 * 3) {
        return sendResponse(res, 400, 'Bad Request Size');
      }

      // Verificamos que la extensión de la imagen sea valido
      if (
        req.file.mimetype !== 'image/jpeg' &&
        req.file.mimetype !== 'image/jpg' &&
        req.file.mimetype !== 'image/png'
      ) {
        return sendResponse(res, 400, 'Bad Request Format');
      }

      // Subir con Cloudinary
      await cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: 'Farmashopping/Users/',
        },
        async (errors, result) => {
          // Verificamos si surgio algún error al subir la imagen
          if (errors) {
            return sendResponse(res, 400, 'Bad Request Upload Cloudinary');
          }

          // Asignamos la url de la imagen
          data.image = {
            publicId: result!.public_id,
            url: result!.secure_url,
          };
          deleteCloudinaryImage(res, item.image!.publicId);
        }
      );
    }

    // Actualizamos el estado
    await item.updateOne(data);

    // Mandamos la respuestas
    sendResponse(res, 200, 'Success');
  } catch (error: any) {
    // Eliminamos la imagen subida a Cloudinary en caso de haber salido mal la creación del item
    await deleteCloudinaryImage(res, item.image!.publicId);
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  } finally {
    if (req.file) {
      removeTemporalImage(res, req.file.path);
    }
  }
};

// Login
export const login = async (req: Request, res: Response) => {
  try {
    // Data mandada desde el body
    const data: IUserCreate = req.body;

    // Documento obtenido por el email desde la db
    const item = await UserModel.findOne({ email: data.email });

    // Verificamos si encontró el documento
    if (!item) {
      return sendResponse(res, 404, 'Usuario no encontrado');
    }

    if (!item.state) {
      return sendResponse(res, 404, 'Usuario desactivado');
    }

    // Comparamos las contraseña ingresada con la contraseña guardada
    const match = await bcrypt.compare(data.password, item.password!);

    if (match) {
      // Creamos el token
      const token = jwt.sign({ _id: item._id }, process.env.SECRET_JWT!);

      // Mandamos la respuesta con la data del nuevo documento junto al token
      return sendResponse<IUser>(res, 200, 'Success', {
        ...item.toObject(),
        password: undefined,
        token,
      });
    }

    // Mandamos la respuesta en caso de que la contraseña sea incorrecta
    return sendResponse(res, 400, 'Contraseña incorrecta');
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};

// Enviar email para restablecer la contraseña
export const sendEmail = async (req: Request, res: Response) => {
  try {
    // Data mandada desde el body
    const data: IUserCreate = req.body;

    // Documento obtenido por el email desde la db
    const item = await UserModel.findOne({ email: data.email });

    // Verificamos si encontró el documento
    if (!item) {
      return sendResponse(res, 404, 'Usuario no encontrado');
    }

    // Creamos el token
    const token = jwt.sign({ _id: item._id }, process.env.SECRET_JWT!, {
      expiresIn: '1800s',
    });

    const setUserToken = await UserModel.findByIdAndUpdate(
      { _id: item._id },
      { verifyToken: token },
      { new: true }
    );

    if (setUserToken) {
      const mailOptions = {
        from: 'nonameggg000@gmail.com',
        to: data.email,
        subject: 'Restablecimiento de contraseña',
        text: `Hola, para restablecer tu contraseña en el Sistema Web de Farmashopping, haz clic en el siguiente enlace https://farmashopping-almacen.netlify.app/restablecer-password/${item._id}/${setUserToken.verifyToken}. Este enlace estará disponible por 30 minutos.`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return sendResponse(res, 400, 'No se pudo enviar el email');
        }
      });

      // Enviamos la respuesta
      return sendResponse(res, 200, 'Email enviado correctamente');
    }
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};

// Resteblecer la contraseña
export const recoveryPassword = async (req: Request, res: Response) => {
  try {
    // Extraemos el id y token de los parametros
    const { id, token } = req.params;

    // Extraemos la nueva contraseña del body
    const data = req.body;

    // Documento obtenido por el id y token desde la db
    const item = await UserModel.findOne({ _id: id, verifyToken: token });

    // Verificamos si encontró el documento
    if (!item) {
      return sendResponse(res, 404, 'Not Found');
    }

    jwt.verify(token, process.env.SECRET_JWT!, async (error) => {
      if (error) {
        return sendResponse(res, 401, error.message);
      }

      // Encriptamos la contraseña
      data.newPassword = await bcrypt.hash(data.newPassword, 10);

      // Actualizamos el documento
      await item.updateOne({ password: data.newPassword });

      // Mandamos la respuesta
      sendResponse(res, 200, 'Success');
    });
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};

const removeTemporalImage = async (res: Response, path: string) => {
  if (path) {
    await fs.unlink(path, (error) => {
      if (error) {
        // Mandamos el error capturado
        sendResponse(res, 500, error.message);
      }
    });
  }
};

// Función para eliminar la imagen de Cloudinary
const deleteCloudinaryImage = async (res: Response, publicId: string) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error: any) {
    // Mandamos el error capturado
    sendResponse(res, 500, error.message);
  }
};
