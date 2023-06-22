import mongoose, { model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { PolyglotConceptMap } from '../types/PolyglotConcept';

export interface PolyglotConceptMapModel extends Model<PolyglotConceptMap> {}

const options = {}

export const conceptMapSchema = new mongoose.Schema<PolyglotConceptMap>({
    _id: { 
        type: String,
        required: true,
        default: () => uuidv4(),
        validate: {
            validator: (id : string) => validator.isUUID(id),
            message: "Invalid UUID-v4"
        }
    },
    nodes: {
        type: [{
            _id: { 
                type: String,
                required: true,
                default: () => uuidv4(),
                validate: {
                    validator: (id : string) => validator.isUUID(id),
                    message: "Invalid UUID-v4"
                }
            },
            name: {type: String}
        }],
        default: []
    },
    edges: {
        type: [{
            _id: { 
                type: String,
                required: true,
                default: () => uuidv4(),
                validate: {
                    validator: (id : string) => validator.isUUID(id),
                    message: "Invalid UUID-v4"
                }
            },
            from: {type: String},
            to: {type: String}
        }],
        default: []
    },
    // add author field TODO: need refactor of auth0 and gen concept map
}, options);

export const PolyglotConceptMapModel = model<PolyglotConceptMap, PolyglotConceptMapModel>("Conceptmap", conceptMapSchema);