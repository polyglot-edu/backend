import mongoose, { model, Model } from 'mongoose';
import { PolyglotFlow } from "../types/PolyglotFlow";
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import User from './user.model';


export const flowSchema = new mongoose.Schema<PolyglotFlow>({
    _id: { 
        type: String,
        required: true,
        default: () => uuidv4(),
        validate: {
            validator: (id : string) => validator.isUUID(id),
            message: "Invalid UUID-v4"
        }
    },
    author: {
      type: String,
      required: true,
      ref: 'User'
    },
    title: { 
      type: String,
      required: true,
    },
    description: { 
      type: String,
      required: true
    },
    nodes: [{type: String, required: true, ref: 'Node'}],
    edges: [{type: String, required: true, ref: 'Edge'}]
})

export interface PolyglotFlowModel extends Model<PolyglotFlow>{

}

export default model<PolyglotFlow, PolyglotFlowModel>("Flow", flowSchema)

