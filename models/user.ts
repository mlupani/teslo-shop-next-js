import mongoose, { Schema, model, Model } from 'mongoose'
import { IUser } from '../interfaces'

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'client'],
      message: '{VALUE} is not a valid rol',
      default: 'client',
      require: true
    }
  }
}, {
  timestamps: true
})

const User: Model<IUser> = mongoose.models.User || model('User', UserSchema)

export default User
