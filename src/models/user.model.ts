import mongoose, { model, Model } from 'mongoose';
import { IUser } from '../interfaces/user';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      default: 'grosser',
      enum: {
        values: ['admin', 'grosser'],
        message: '{VALUE} role is invalid',
      },
      required: true,
    },
    birthDate: { type: Date, required: false },
    image: {
      publicId: { type: String, require: false },
      url: { type: String, require: false },
    },
    verifyToken: { type: String, required: false },
    state: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel: Model<IUser> =
  mongoose.models.User || model('User', userSchema);

export default UserModel;
