import mongoose from "mongoose";
import { EducationLevel, LearningObjectives, Topic } from "../types";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

export type PolyglotCourseDocument = Document & {
  _id: string;
  title: string;
  description: string;
  subjectArea: string;
  macro_subject: string;
  education_level: EducationLevel;
  language: string;
  duration: string;
  learningObjectives: LearningObjectives;
  goals: string[];
  prerequisites: string[];
  topics: string[];
  topicsAI: Topic[];
  tags: { name: string; color: string }[];
  img?: string;
  accessCode?: string;
  sourceMaterial?: string;
  classContext: string;
  flowsId: string[];
  author: {
    _id?: string;
    username?: string;
  };
  targetAudience: string;
  published: boolean;
  lastUpdate: Date;
  nSubscribed: number;
  nCompleted: number;
};

export const courseSchema = new mongoose.Schema<PolyglotCourseDocument>({
  _id: {
    type: String,
    default: () => uuidv4(),
    validate: {
      validator: (id: string) => validator.isUUID(id),
      message: "Invalid UUID-v4",
    },
  },
  title: { type: String, required: true },
  description: { type: String, required: false },
  subjectArea: { type: String, required: false },
  macro_subject: { type: String, required: false },
  education_level: { type: String, required: false },
  language: { type: String, required: false },
  duration: { type: String, required: false },

  learningObjectives: {
    type: {
      knowledge: { type: String },
      skills: { type: String },
      attitude: { type: String },
    },
    required: true,
  },

  goals: {
    type: [{ type: String }],
    default: [],
  },

  prerequisites: {
    type: [{ type: String }],
    default: [],
  },

  topics: {
    type: [{ type: String }],
    default: [],
  },

  topicsAI: {
    type: [
      {
        topic: { type: String },
        explanation: { type: String },
      },
    ],
    default: [],
  },

  tags: {
    type: [
      {
        name: { type: String },
        color: { type: String },
      },
    ],
    default: [],
  },

  img: { type: String, default: "" },
  sourceMaterial: { type: String },
  accessCode: { type: String, default: "" },

  classContext: { type: String, required: false },
  targetAudience: { type: String, required: false },

  flowsId: {
    type: [{ type: String }],
    default: [],
  },

  author: {
    _id: { type: String },
    username: { type: String },
  },

  published: { type: Boolean, default: false },
  lastUpdate: { type: Date, default: () => new Date() },
  nSubscribed: { type: Number, default: 0 },
  nCompleted: { type: Number, default: 0 },
});

const Course = mongoose.model<PolyglotCourseDocument>("Course", courseSchema);

export default Course;
