import mongoose, { model, Model } from 'mongoose';
import { PolyglotFlow } from "../types/PolyglotFlow";
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { PolyglotNodeModel } from './node.model';

const NODE_TYPES = [
  'Abstract',
  'CloseEndedQuestion',
  'CodingQuestion',
  'Lesson',
  'MultipleChoiceQuestion'
]

const EDGE_TYPES = [
  'CustomValidation',
  'ExactValue',
  'PassFail'
]


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
const cast = flowSchema.obj as any;
console.log(cast._id.type.toString());

export interface PolyglotFlowModel extends Model<PolyglotFlow>{

}

export default model<PolyglotFlow, PolyglotFlowModel>("Flow", flowSchema)

