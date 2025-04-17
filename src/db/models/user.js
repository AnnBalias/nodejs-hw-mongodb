import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp } from '../../constants/auth.js';

const userShema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
userShema.post('save', handleSaveError);

userShema.pre('findOneAndUpdate', setUpdateSettings);
userShema.post('findOneAndUpdate', handleSaveError);

const UsersCollection = model('user', userShema);

export default UsersCollection;
