import { IUser } from './user';

export interface IOrderRecorder {
  _id: string;
  date: Date;
  numberNote: string;
  name: string;
  user: IUser;
  observation: string;
  state: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderRecorderCreate {
  date: Date;
  numberNote: string;
  name: string;
  user: IUser;
  observation?: string;
  state: boolean;
}
