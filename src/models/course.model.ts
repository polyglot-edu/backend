import mongoose from "mongoose";
import { EducationLevel } from "../types/AIGenerativeTypes";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";

export type CourseDocument = Document & {
  _id?: string;
  title?: string;
  description?: string;
  subjectArea?: string;
  macro_subject?: string;
  education_level?: EducationLevel;
  language?: string;
  duration?: string;
  learningObjectives?: string;
  topics?: string[];
  accessCode?: string;
  topicsAI?: { topic: string; explanation: string }[];
  tags?: { name: string; color: string }[];
  img?: string;
  sourceMaterial?: string;
  context?: string;
  learningContext?: string;
  flowsId?: string[];
  author?: {
    _id?: string;
    username?: string;
  };
  published?: boolean;
  lastUpdate?: Date;
  nSubscribed?: number;
  nCompleted?: number;
};

export const courseSchema = new mongoose.Schema<CourseDocument>({
  _id: {
    type: String,
    default: () => uuidv4(),
    validate: {
      validator: (id: string) => validator.isUUID(id),
      message: "Invalid UUID-v4",
    },
  },
  title: { type: String },
  description: { type: String },
  subjectArea: { type: String },
  macro_subject: { type: String },
  education_level: { type: String },
  language: { type: String },
  duration: { type: String },
  learningObjectives: { type: String },

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
  context: { type: String },
  learningContext: { type: String },

  flowsId: {
    type: [{ type: String }],
    default: [],
  },
  accessCode: { type: String, default: "" },
  author: {
    _id: { type: String },
    username: { type: String },
  },

  published: { type: Boolean, default: false },
  lastUpdate: { type: Date, default: () => new Date() },
  nSubscribed: { type: Number, default: 0 },
  nCompleted: { type: Number, default: 0 },
});

const Course = mongoose.model<CourseDocument>("Course", courseSchema);

export default Course;
