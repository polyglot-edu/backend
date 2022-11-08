import mongoose, { model, Model } from 'mongoose';
import { PolyglotFlow } from "../types/PolyglotFlow";
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

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
    title: { 
      type: String,
      required: true,
    },
    description: { 
      type: String,
      required: true
    },
    nodes: [{
        type: { 
          type: String,
          enum: NODE_TYPES,
          required: true
        },
        title: {
          type: String,
          default: "Node"
        },
        description: { type: String},
        difficulty: {
          type: Number,
          min: 1,
          max: 5
        },
        data: { type: {}},
        reactFlow: {
          type: {}
        },
    }],
    edges: [{ 
        type: {
          type: String,
          enum: EDGE_TYPES,
          required: true
        },
        title: {
          type: String,
          default: "Edge"
        },
        code: { type: String},
        data: { type: {}},
        reactFlow: { type: {}},
    }]
})

export interface PolyglotFlowModel extends Model<PolyglotFlow>{

}

export default model<PolyglotFlow, PolyglotFlowModel>("Flow", flowSchema)

