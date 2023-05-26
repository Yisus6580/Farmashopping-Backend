import mongoose, { Model, Types, model } from 'mongoose';
import { IShippingRecorder } from '../interfaces/shippingRecorder';

const ShippingRecorderSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    namePharmacy: { type: String, required: true },
    typeBox: { type: String, required: true },
    boxNumber: { type: Number, required: true },
    numberNotes: {
      type: [String],
      required: true,
    },
    province: { type: String, required: true },
    observation: { type: String, required: false },
    user: { type: Types.ObjectId, ref: 'User' },
    state: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ShippingRecorderModel: Model<IShippingRecorder> =
  mongoose.models.ShippingRecorder ||
  model('ShippingRecorder', ShippingRecorderSchema);

export default ShippingRecorderModel;
