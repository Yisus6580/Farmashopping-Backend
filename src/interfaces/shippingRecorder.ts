export interface IShippingRecorder {
  _id: string;
  date: Date;
  namePharmacy: string;
  typeBox: string;
  boxNumber: number;
  numberNote: string[];
  province: string;
  observation: string;
  state: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShippingRecorderCreate {
  date: Date;
  namePharmacy: string;
  typeBox: string;
  boxNumber: string;
  numberNote: string[];
  province: string;
  observation?: string;
  state: boolean;
}
