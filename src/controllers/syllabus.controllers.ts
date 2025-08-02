import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { v4 as uuidv4 } from "uuid";
import PolyglotSyllabusModel from "../models/syllabus.models";

// CREATE
export async function createSyllabus(req: Request, res: Response) {
  const userId = req.user?._id;

  const {
    title,
    description,
    educational_level,
    additional_information = "",
    language,
    goals = [],
    prerequisites = [],
    topics,
    academicYear,
    courseCode,
    courseOfStudy,
    semester,
    credits,
    teachingHours,
    disciplinarySector,
    teachingMethods = [],
    assessmentMethods = [],
    referenceMaterials = [],
    studyRegulation,
    curriculumPath,
    studentPartition,
    integratedCourseUnit,
    subjectArea,
    courseType,
    department,
    courseYear,
  } = req.body;

  try {
    if (!title || !description) {
      return res.status(400).send("Title and description are required");
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const existingSyllabus = await PolyglotSyllabusModel.findOne({ title });
    if (existingSyllabus) {
      return res.status(400).send("Syllabus with this title already exists");
    }

    const syllabus = new PolyglotSyllabusModel({
      _id: uuidv4(),
      title,
      description,
      educational_level,
      additional_information,
      language,
      goals,
      prerequisites,
      topics,
      author: {
        _id: user._id,
        username: user.username,
      },
      lastUpdate: new Date(),
      academicYear,
      courseCode,
      courseOfStudy,
      semester,
      credits,
      teachingHours,
      disciplinarySector,
      teachingMethods,
      assessmentMethods,
      referenceMaterials,
      studyRegulation,
      curriculumPath,
      studentPartition,
      integratedCourseUnit,
      subjectArea,
      courseType,
      department,
      courseYear,
    });

    await syllabus.save();
    const created = await PolyglotSyllabusModel.findById(syllabus._id).lean();

    return res.status(201).json(created);
  } catch (err) {
    console.error("Error creating syllabus:", err);
    return res.status(500).send("Internal server error");
  }
}

// UPDATE
export async function updateSyllabus(req: Request, res: Response) {
  const userId = req.user?._id;

  const {
    _id,
    title,
    description,
    educational_level,
    additional_information,
    language,
    goals = [],
    prerequisites = [],
    topics = {},
    academicYear,
    courseCode,
    courseOfStudy,
    semester,
    credits,
    teachingHours,
    disciplinarySector,
    teachingMethods = [],
    assessmentMethods = [],
    referenceMaterials = [],
    studyRegulation,
    curriculumPath,
    studentPartition,
    integratedCourseUnit,
    subjectArea,
    courseType,
    department,
    courseYear,
  } = req.body;

  try {
    if (!userId) return res.status(400).send("userId is required");
    if (!_id) return res.status(400).send("syllabus_id is required");
    if (!title) return res.status(400).send("title is required");

    const syllabus = await PolyglotSyllabusModel.findById(_id);
    if (!syllabus) return res.status(404).send("Syllabus not found");

    Object.assign(syllabus, {
      title,
      description,
      educational_level,
      additional_information,
      language,
      goals,
      prerequisites,
      topics,
      lastUpdate: new Date(),
      academicYear,
      courseCode,
      courseOfStudy,
      semester,
      credits,
      teachingHours,
      disciplinarySector,
      teachingMethods,
      assessmentMethods,
      referenceMaterials,
      studyRegulation,
      curriculumPath,
      studentPartition,
      integratedCourseUnit,
      subjectArea,
      courseType,
      department,
      courseYear,
    });

    await syllabus.save();
    const updated = await PolyglotSyllabusModel.findById(_id).lean();
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating syllabus:", err);
    return res.status(500).send("Internal server error");
  }
}

// DELETE
export async function deleteSyllabus(req: Request, res: Response) {
  const syllabusId = req.params.id;
  const userId = req.user?._id;

  try {
    if (!userId) return res.status(400).send("userId is required");
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");
    if (!syllabusId) return res.status(404).send("SyllabusId is required");

    const dbSyllabus = await PolyglotSyllabusModel.findById(syllabusId);
    if (!dbSyllabus) return res.status(404).send("Syllabus not found");

    await PolyglotSyllabusModel.deleteOne({ _id: syllabusId });
    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting syllabus:", err);
    return res.status(500).send("Internal server error");
  }
}

// GET BY ID
export async function getSyllabusById(req: Request, res: Response) {
  try {
    const syllabusId = req.params.id;
    if (!syllabusId)
      return res.status(400).json({ error: "Missing syllabus ID" });

    const syllabus = await PolyglotSyllabusModel.findById(syllabusId).lean();
    if (!syllabus) return res.status(404).json({ error: "Syllabus not found" });

    return res.json(syllabus);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET ALL
export async function getSyllabuses(req: Request, res: Response) {
  try {
    const q = req.query?.q?.toString();
    const me = req.query?.me?.toString();

    const query: any = q ? { title: { $regex: q, $options: "i" } } : {};
    if (me) query["author._id"] = req.user?._id;

    const syllabuses = await PolyglotSyllabusModel.find(query).lean();
    return res.json(syllabuses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// CLEANUP
export async function serverCleanUp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.params.password !== "polyglotClean") throw "Wrong password";
    const resp = await PolyglotSyllabusModel.deleteMany();
    console.log(resp);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

// JSON API
export async function createSyllabusJson(req: Request, res: Response) {
  try {
    const input = req.body;

    const syllabus = {
      ...input,
      _id: uuidv4(),
      lastUpdate: new Date(),
      author: {
        _id: req.user?._id,
        username: req.user?.username,
      },
    };

    const created = await PolyglotSyllabusModel.create(syllabus);
    return res.status(200).send({ id: created._id });
  } catch (err: any) {
    console.error("Error creating syllabus:", err);
    return res.status(500).send({
      error: "Internal Server Error during syllabus creation",
      details: err.message || err,
    });
  }
}
