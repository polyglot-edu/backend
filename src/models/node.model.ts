import mongoose, { model, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { PolyglotNode } from '../types';
import { conceptMapSchema } from './concept.models';

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
    reactFlow: {
        type: {}
    },
    runtimeData: {type: {}},
    platform: {
        type:String,    
        default:"VSCode"
    }
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
        target: {type: String},
        conceptmap: {type: conceptMapSchema},
        execution: {type: {}}
    }
}, options);
//learning nodes:
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

export const WatchVideoNodeSchema = new mongoose.Schema({
    data: {
        link: {type: String}
    }
}, options);

export const ReadMaterialNodeSchema = new mongoose.Schema({
    data: {
        text: {type: String},
        link: {type: String}
    }
}, options);

export const CreateKeywordsListNodeSchema = new mongoose.Schema({
    data: {
        instructions: {type: String}
    }
}, options);

export const MemoriseKeywordsListNodeSchema = new mongoose.Schema({
    data: {
        instructions: {type: String},
        keywords: [{type: String}]
    }
}, options);

export const SummaryNodeSchema = new mongoose.Schema({
    data: {
        text: {type: String}, 
        link: {type: String}, 
        uploadLearner: {type: Boolean}
    }
}, options);

export const MindMapNodeSchema = new mongoose.Schema({
    data: {
        text: {type: String}, 
        link: {type: String}, 
        uploadLearner: {type: Boolean}
    }
}, options);

export const ProblemSolvingNodeSchema = new mongoose.Schema({
    data: {
        text: {type: String}, 
        link: {type: String}, 
        uploadLearner: {type: Boolean}
    }
}, options);

export const FindSolutionNodeSchema = new mongoose.Schema({
    data: {
        text: {type: String}, 
        link: {type: String}, 
        uploadLearner: {type: Boolean}
    }
}, options);

//assessment nodes:
export const closeEndedQuestionNodeSchema = new mongoose.Schema({
    data: {
        question: {type: String},
        correctAnswers: [{type: String}],
        isAnswerCorrect: [{type: Boolean}]        
    }
}, options);

export const openQuestionNodeSchema = new mongoose.Schema({
    data: {
        question: {type: String},
        material: {type: String},
        aiQuestion: {type: Boolean},
        language: {type: String},
        questionGenerated: {type: String},
        possibleAnswer: {type: String},
        questionCategory: {type: Number},
        questionType: {type: Number},
    }
}, options);

export const codingQuestionNodeSchema = new mongoose.Schema({
    data: {
        question: {type: String},
        codeTemplate: {type: String, default: ""},
        language: {type: String, enum: ["csharp","sysml"], default: "csharp"}
    }
}, options);

export const multipleChoiceQuestionNodeSchema = new mongoose.Schema({
    data: {
        question: {type: String},
        choices: [{type: String}],
        isChoiceCorrect: [{type: Boolean}]
    }
}, options);

export const TrueFalseNodeSchema = new mongoose.Schema({
    data: {
        instructions: {type: String},
        questions: [{type: String}],
        isQuestionCorrect: [{type: Boolean}],
        negativePoints: {type: Number},
        positvePoints: {type: Number}
    }
}, options);

export const ImageEvaluationNodeSchema = new mongoose.Schema({
    data: {
        link: {type: String},
        question: {type: String},
        answers: [{type: String}],
        isAnswerCorrect: [{type: Boolean}]
    }
}, options);

export const CasesEvaluationNodeSchema = new mongoose.Schema({
    data: {
        guidelines: {type: String}, 
        text: {type: String}, 
        link: {type: String}, 
        uploadLearner: {type: Boolean}
    }
}, options);

export const InnovationPitchNodeSchema = new mongoose.Schema({
    data: {
        guidelines: {type: String}, 
        text: {type: String}, 
        link: {type: String}, 
        uploadLearner: {type: Boolean}
    }
}, options);

export const PolyglotNodeModel = model<PolyglotNode, PolyglotNodeModel>("Node", nodeSchema);

export const AbstractNode = PolyglotNodeModel.discriminator('abstractNode', abstractNodeSchema);

export const LessonNode = PolyglotNodeModel.discriminator('lessonNode', LessonNodeSchema);

export const LessonTextNode = PolyglotNodeModel.discriminator('lessonTextNode', LessonTextNodeSchema);

export const WatchVideoNode = PolyglotNodeModel.discriminator('WatchVideoNode', WatchVideoNodeSchema);

export const ReadMaterialNode = PolyglotNodeModel.discriminator('ReadMaterialNode', ReadMaterialNodeSchema);

export const CreateKeywordsListNode = PolyglotNodeModel.discriminator('CreateKeywordsListNode', CreateKeywordsListNodeSchema);

export const MemoriseKeywordsListNode = PolyglotNodeModel.discriminator('MemoriseKeywordsListNode', MemoriseKeywordsListNodeSchema);

export const SummaryNode = PolyglotNodeModel.discriminator('SummaryNode', SummaryNodeSchema);

export const MindMapNode = PolyglotNodeModel.discriminator('MindMapNode', MindMapNodeSchema);

export const ProblemSolvingNode = PolyglotNodeModel.discriminator('ProblemSolvingNode', ProblemSolvingNodeSchema);

export const FindSolutionNode = PolyglotNodeModel.discriminator('FindSolutionNode', FindSolutionNodeSchema);

export const CloseEndedQuestionNode = PolyglotNodeModel.discriminator('closeEndedQuestionNode', closeEndedQuestionNodeSchema);

export const OpenQuestionNode = PolyglotNodeModel.discriminator('openQuestionNode', openQuestionNodeSchema);

export const CodingQuestionNode = PolyglotNodeModel.discriminator('codingQuestionNode', codingQuestionNodeSchema);

export const MultipleChoiceQuestionNode = PolyglotNodeModel.discriminator('multipleChoiceQuestionNode', multipleChoiceQuestionNodeSchema);

export const TrueFalseNode = PolyglotNodeModel.discriminator('TrueFalseNode', TrueFalseNodeSchema);

export const ImageEvaluationNode = PolyglotNodeModel.discriminator('ImageEvaluationNode', ImageEvaluationNodeSchema);

export const CasesEvaluationNode = PolyglotNodeModel.discriminator('CasesEvaluationNode', CasesEvaluationNodeSchema);

export const InnovationPitchNode = PolyglotNodeModel.discriminator('InnovationPitchNode', InnovationPitchNodeSchema);
