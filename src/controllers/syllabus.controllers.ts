import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { v4 as uuidv4 } from "uuid";
import PolyglotSyllabusModel from "../models/syllabus.models";

//change from course type

export async function createSyllabus(req: Request, res: Response) {
  const userId = req.user?._id;

  const {
    title,
    description,
    general_subject,
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
  } = req.body;

  try {
    if (!title) return res.status(400).send("title is required");
    if (!description) return res.status(400).send("description is required");

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const existingSyllabus = await PolyglotSyllabusModel.findOne({ title });
    if (existingSyllabus)
      return res.status(400).send("Syllabus with this title already exists.");

    const syllabus = new PolyglotSyllabusModel({
      _id: uuidv4(),
      title,
      description,
      general_subject,
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
    });

    await syllabus.save();

    const createdSyllabus = await PolyglotSyllabusModel.findById(
      syllabus._id,
    ).lean();

    return res.status(201).json(createdSyllabus);
  } catch (err) {
    console.error("Error creating syllabus:", err);
    return res.status(500).send("Internal server error");
  }
}

export async function updateSyllabus(req: Request, res: Response) {
  const userId = req.user?._id;

  const {
    _id,
    title,
    description,
    general_subject,
    educational_level,
    additional_information,
    language,
    goals = [],
    prerequisites = [],
    topics = [],
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
  } = req.body;

  try {
    if (!userId) return res.status(400).send("userId is required");
    if (!_id) return res.status(400).send("syllabus_id is required");
    if (!title) return res.status(400).send("title is required");

    const syllabus = await PolyglotSyllabusModel.findById(_id);
    if (!syllabus) return res.status(404).send("Syllabus not found");

    syllabus.title = title;
    syllabus.description = description;
    syllabus.general_subject = general_subject;
    syllabus.educational_level = educational_level;
    syllabus.additional_information = additional_information;
    syllabus.language = language;
    syllabus.goals = goals;
    syllabus.prerequisites = prerequisites;
    syllabus.topics = topics;
    syllabus.lastUpdate = new Date();

    syllabus.academicYear = academicYear;
    syllabus.courseCode = courseCode;
    syllabus.courseOfStudy = courseOfStudy;
    syllabus.semester = semester;
    syllabus.credits = credits;
    syllabus.teachingHours = teachingHours;
    syllabus.disciplinarySector = disciplinarySector;
    syllabus.teachingMethods = teachingMethods;
    syllabus.assessmentMethods = assessmentMethods;
    syllabus.referenceMaterials = referenceMaterials;

    await syllabus.save();

    const updatedSyllabus = await PolyglotSyllabusModel.findById(_id).lean();
    return res.status(200).json(updatedSyllabus);
  } catch (err) {
    console.error("Error updating syllabus:", err);
    return res.status(500).send("Internal server error");
  }
}

export async function deleteSyllabus(req: Request, res: Response) {
  const syllabusId = req.params.id;
  const userId = req.user?._id;
  try {
    if (!userId) {
      return res.status(400).send("userId is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!syllabusId) {
      return res.status(404).send("SyllabusId is required");
    }

    const dbSyllabus = await PolyglotSyllabusModel.findById(syllabusId);
    if (!dbSyllabus) {
      return res.status(404).send("Syllabus not found");
    }

    await PolyglotSyllabusModel.deleteOne({ _id: syllabusId });

    return res.status(204).send();
  } catch (err) {
    res.status(500).send;
  }
}

export async function serverCleanUp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.params.password != "polyglotClean") throw "Wrong password";

    const resp = await PolyglotSyllabusModel.deleteMany();
    console.log(resp);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function getSyllabusById(req: Request, res: Response) {
  try {
    const syllabusId = req.params.id;

    if (!syllabusId) {
      return res.status(400).json({ error: "Missing syllabus ID" });
    }

    const syllabus = await PolyglotSyllabusModel.findById(syllabusId).lean();

    if (!syllabus) {
      return res.status(404).json({ error: "Syllabus not found" });
    }

    return res.json(syllabus);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getSyllabuses(req: Request, res: Response) {
  try {
    const q = req.query?.q?.toString();
    const me = req.query?.me?.toString();

    const query: any = q ? { title: { $regex: q, $options: "i" } } : {};

    if (me) {
      query["author._id"] = req.user?._id;
    }

    const syllabuses = await PolyglotSyllabusModel.find(query).lean();

    return res.json(syllabuses);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

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

    const createdSyllabus = await PolyglotSyllabusModel.create(syllabus);
    return res.status(200).send({ id: createdSyllabus._id });
  } catch (err: any) {
    console.error("Error creating syllabus:", err);
    return res.status(500).send({
      error: "Internal Server Error during syllabus creation",
      details: err.message || err,
    });
  }
}
