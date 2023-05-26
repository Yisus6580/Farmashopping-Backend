import mongoose, { Model, model, Types } from 'mongoose';
import { IOrderRecorder } from '../interfaces/orderRecorder';

const OrderRecorderSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    numberNote: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    user: { type: Types.ObjectId, ref: 'User' },
    observation: { type: String, required: false },
    state: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const OrderRecorderModel: Model<IOrderRecorder> =
  mongoose.models.OrderRecorder || model('OrderRecorder', OrderRecorderSchema);

export default OrderRecorderModel;
