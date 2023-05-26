export interface IUser {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  role: rols;
  birthDate?: Date;
  image?: userImage;
  state: boolean;
  token: string;
  verifyToken: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreate {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: rols;
  birthDate?: Date;
  image?: userImage;
  state: boolean;
  token: string;
}

export interface IUserEdit {
  name: string;
  lastName: string;
  email: string;
  role: rols;
  birthDate?: Date;
  image?: userImage;
}

type rols = 'admin' | 'grosser';

type userImage = {
  publicId: string;
  url: string;
};
