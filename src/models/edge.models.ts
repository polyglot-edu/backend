import mongoose, { model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { PolyglotEdge, PolyglotNode } from '../types';
import { Int8 } from '../types/mongoose/customTypes';

const options = { discriminatorKey: 'type' };

const EDGE_TYPES = [
  'CustomValidation',
  'ExactValue',
  'PassFail'
]

export interface PolyglotEdgeDocument extends PolyglotEdge, Document {
    minify(): unknown;
}

export interface PolyglotEdgeModel extends Model<PolyglotEdge> {}

export const edgeSchema = new mongoose.Schema<PolyglotEdge>({
    _id: { 
        type: String,
        required: true,
        default: () => uuidv4(),
        validate: {
            validator: (id : string) => validator.isUUID(id),
            message: "Invalid UUID-v4"
        }
    },
    code: {
      type: String
    },
    title: {
      type: String,
      default: ""
    },
    reactFlow: { type: {}},
}, options);

// Serve per modificare l'output delle query (da valutare il possibile utilizzo)
// edgeSchema.methods.minify = async function(this: PolyglotEdgeDocument) {
//     const response: PolyglotNode = {
//         _id: this._id,
//         type: this.type,
//         title: this.title,
//         description: this.description,
//         _data: this._data,
//         difficulty: this.difficulty,
//         _reactFlow: this._reactFlow
//     }
//     return response;
// }

export const customValidationEdgeSchema = new mongoose.Schema({
    data: {
      code: {type: Int8}
    }
}, options);

export const exactValueEdgeSchema = new mongoose.Schema({
    data: {
      value: {type: String}
    }
}, options);

export const passFailEdgeSchema = new mongoose.Schema({
  data: {
    conditionKind: {type: String, enum: ['pass', 'fail']}
  }
}, options);

export const PolyglotEdgeModel = model<PolyglotEdge, PolyglotEdgeModel>("Edge", edgeSchema);

export const CustomValidationEdge = PolyglotEdgeModel.discriminator('customValidationEdge', customValidationEdgeSchema);

export const ExactValueEdge = PolyglotEdgeModel.discriminator('exactValueEdge', exactValueEdgeSchema);

export const PassFailEdge = PolyglotEdgeModel.discriminator('passFailEdge', passFailEdgeSchema);
