import mongoose from "mongoose";
import { EducationLevel, LearningObjectives, Topic } from "../types";
import validator from "validator";
import { v4 as uuidv4 } from "uuid";
import { SyllabusTopic } from "../types";

export type PolyglotSyllabusDocument = Document & {
  _id: string;
  educational_level: EducationLevel;
  additional_information: string;
  title: string;
  description: string;
  goals: string[];
  topics: SyllabusTopic;
  prerequisites: string[];
  language: string;
  author: {
    _id?: string;
    username?: string;
  };
  lastUpdate: Date;

  studyRegulation: string;
  curriculumPath: string;
  studentPartition: string;
  integratedCourseUnit: string;
  subjectArea: string;
  courseType: string;
  department: string;

  academicYear?: string;
  courseCode?: string;
  courseOfStudy?: string;
  semester?: string;
  credits?: number;
  teachingHours?: number;
  disciplinarySector?: string;
  teachingMethods?: string[];
  assessmentMethods?: string[];
  referenceMaterials?: string[];
};

const learningObjectivesSchema = {
  knowledge: { type: String },
  skills: { type: String },
  attitude: { type: String },
};

const syllabusTopicSchema = {
  macro_topic: { type: String, required: true },
  details: { type: String, required: true },
  learning_objectives: learningObjectivesSchema,
};

export const polyglotSyllabusSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
    validate: {
      validator: (id: string) => validator.isUUID(id),
      message: "Invalid UUID-v4",
    },
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  educational_level: { type: String, required: true },
  additional_information: { type: String, required: false },
  language: { type: String, required: true },

  goals: {
    type: [{ type: String }],
    default: [],
  },

  prerequisites: {
    type: [{ type: String }],
    default: [],
  },

  topics: {
    type: [syllabusTopicSchema],
    default: [],
  },

  author: {
    _id: { type: String },
    username: { type: String },
  },

  lastUpdate: {
    type: Date,
    default: () => new Date(),
  },

  studyRegulation: { type: String },
  curriculumPath: { type: String },
  studentPartition: { type: String },
  integratedCourseUnit: { type: String },
  subjectArea: { type: String },
  courseType: { type: String },
  department: { type: String },
  courseYear: { type: String },
  academicYear: { type: String },
  courseCode: { type: String },
  courseOfStudy: { type: String },
  semester: { type: String },
  credits: { type: Number },
  teachingHours: { type: Number },
  disciplinarySector: { type: String },
  teachingMethods: {
    type: [{ type: String }],
    default: [],
  },
  assessmentMethods: {
    type: [{ type: String }],
    default: [],
  },
  referenceMaterials: {
    type: [{ type: String }],
    default: [],
  },
});

const PolyglotSyllabusModel = mongoose.model<PolyglotSyllabusDocument>(
  "PolyglotSyllabus",
  polyglotSyllabusSchema,
);

export default PolyglotSyllabusModel;
