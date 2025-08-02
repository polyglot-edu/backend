import { EducationLevel, LearningObjectives } from "./AIGenerativeTypes";

export type SyllabusTopic = {
  macro_topic: string;
  details: string;
  learning_objectives: LearningObjectives;
};
export type PolyglotSyllabus = {
  _id: string;
  educational_level: EducationLevel;
  additional_information: string;
  title: string;
  description: string;
  goals: string[];
  topics: SyllabusTopic[];
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
  courseYear: string;

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
