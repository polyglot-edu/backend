import mongoose, { model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { PolyglotNode } from '../types';

const options = { discriminatorKey: 'type' };

export interface PolyglotNodeDocument extends PolyglotNode, Document {
    minify(): unknown;
}

export interface PolyglotNodeModel extends Model<PolyglotNode> {}

export const nodeSchema = new mongoose.Schema<PolyglotNode>({
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
        default: "Node"
    },
    description: { type: String},
    difficulty: {
        type: Number,
        enum: [1,2,3,4,5]
    },
    _data: { type: {}},
    reactFlow: {
        type: {}
    },
}, options);

// Serve per modificare l'output delle query (da valutare il possibile utilizzo)
// nodeSchema.methods.minify = async function(this: PolyglotNodeDocument) {
//     console.log("ciao");
//     console.log(this.type);
//     const response: PolyglotNode = {
//         _id: this._id,
//         type: this.type,
//         title: this.title,
//         description: this.description,
//         _data: this._data,
//         difficulty: this.difficulty,
//         reactFlow: this.reactFlow
//     }
//     return response;
// }

export const abstractNodeSchema = new mongoose.Schema({
    data: {
        target: {type: String}
    }
}, options);

export const closeEndedQuestionNodeSchema = new mongoose.Schema({
    data: {
        question: {type: String},
        correctAnswers: [{type: String}]
    }
}, options);

export const codingQuestionNodeSchema = new mongoose.Schema({
    data: {
        question: {type: String},
        codeTemplate: {type: String, default: ""},
        language: {type: String, enum: ["csharp"], default: "csharp"}
    }
}, options);

export const LessonNodeSchema = new mongoose.Schema({
    data: {
        file: {type: {}}
    }
}, options);

export const LessonTextNodeSchema = new mongoose.Schema({
    data: {
        text: {type: String}
    }
}, options);

export const multipleChoiceQuestionNodeSchema = new mongoose.Schema({
    data: {
        question: {type: String},
        choices: [{type: String}],
        isChoiceCorrect: [{type: Boolean}]
    }
}, options);

export const PolyglotNodeModel = model<PolyglotNode, PolyglotNodeModel>("Node", nodeSchema);

export const AbstractNode = PolyglotNodeModel.discriminator('abstractNode', abstractNodeSchema);

export const CloseEndedQuestionNode = PolyglotNodeModel.discriminator('closeEndedQuestionNode', closeEndedQuestionNodeSchema);

export const CodingQuestionNode = PolyglotNodeModel.discriminator('codingQuestionNode', codingQuestionNodeSchema);

export const LessonNode = PolyglotNodeModel.discriminator('lessonNode', LessonNodeSchema);

export const LessonTextNode = PolyglotNodeModel.discriminator('lessonTextNode', LessonTextNodeSchema);

export const MultipleChoiceQuestionNode = PolyglotNodeModel.discriminator('multipleChoiceQuestionNode', multipleChoiceQuestionNodeSchema);