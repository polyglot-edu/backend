import mongoose, { model, Model } from 'mongoose';
import { PolyglotFlow } from "../types/PolyglotFlow";
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';


const flowSchema = new mongoose.Schema<PolyglotFlow>({
    _id: { 
        type: String,
        required: true,
        default: () => uuidv4(),
        validate: {
            validator: (id : string) => validator.isUUID(id),
            message: "Invalid UUID-v4"
        }
    },
    title: { type: String},
    description: { type: String},
    nodes: [{
        type: { type: String},
        title: { type: String},
        description: { type: String},
        difficulty: { type: Number},
        data: { type: {}},
        reactFlow: { type: {}},
    }],
    edges: [{ 
        type: { type: String},
        title: { type: String},
        code: { type: String},
        data: { type: {}},
        reactFlow: { type: {}},
    }]
})

export interface PolyglotFlowModel extends Model<PolyglotFlow>{

}

export default model<PolyglotFlow, PolyglotFlowModel>("Flow", flowSchema)

