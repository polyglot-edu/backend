import mongoose, { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

export type UserDocument = Document & {
    username: string;
    email: string;
    googleId: string;
  };


const userSchema = new mongoose.Schema<UserDocument>({
    _id: { 
        type: String,
        required: true,
        default: () => uuidv4(),
        validate: {
            validator: (id : string) => validator.isUUID(id),
            message: "Invalid UUID-v4"
        }
    },
    googleId: {type: String},
    username: { type: String},
    email: { type: String},
})

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;

