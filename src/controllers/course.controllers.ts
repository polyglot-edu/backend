import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import Course, { courseSchema } from "../models/course.model";
import Flow from "../models/flow.model";
import { v4 as uuidv4 } from "uuid";
import { PolyglotCourseWithFlow } from "../types";

export async function createCourse(req: Request, res: Response) {
  const userId = req.user?._id;

  const {
    title,
    description,
    subjectArea,
    macro_subject = "",
    education_level = "",
    language = "",
    duration = "",
    learningObjectives,
    goals = [],
    prerequisites = [],
    topics = [],
    topicsAI = [],
    tags = [],
    img = "",
    accessCode = "",
    sourceMaterial = "",
    classContext = "",
    targetAudience = "",
    flowsId = [],
    published = false,
  } = req.body;

  try {
    if (!userId) return res.status(400).send("userId is required");
    if (!title) return res.status(400).send("title is required");
    if (!description) return res.status(400).send("description is required");

    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    const existingCourse = await Course.findOne({ title });
    if (existingCourse)
      return res.status(400).send("Course with this title already exists");

    // Validate flows
    const flowsNotFound: string[] = [];
    const validFlows: string[] = [];

    for (const flowId of flowsId) {
      if (!flowId) continue;
      const exists = await Flow.exists({ _id: flowId });
      if (exists) {
        validFlows.push(flowId);
      } else {
        flowsNotFound.push(flowId);
      }
    }

    if (flowsNotFound.length > 0) {
      return res
        .status(404)
        .send("Flows not found: " + flowsNotFound.join(", "));
    }

    const course = new Course({
      _id: uuidv4(),
      title,
      description,
      subjectArea,
      macro_subject,
      education_level,
      language,
      duration,
      learningObjectives,
      goals,
      prerequisites,
      topics,
      topicsAI,
      tags,
      img,
      accessCode,
      sourceMaterial,
      classContext,
      targetAudience,
      flowsId: validFlows,
      author: {
        _id: user._id,
        username: user.username,
      },
      published,
      lastUpdate: new Date(),
      nSubscribed: 0,
      nCompleted: 0,
    });

    await course.save();

    const createdCourse = await Course.findById(course._id)
      .populate("author")
      .populate("flows");

    return res.status(201).json(createdCourse);
  } catch (err) {
    console.error("Error creating course:", err);
    return res.status(500).send("Internal server error");
  }
}

export async function updateCourse(req: Request, res: Response) {
  const userId = req.user?._id;
  const {
    _id,
    title,
    description,
    subjectArea,
    learningObjectives,
    accessCode,
    flowsId = [],
    tags = [],
    published = false,
    img = "",
    goals = [],
    prerequisites = [],
    targetAudience = "",
    duration = 0,
    topics = [],
    sourceMaterial = null,
    education_level = null,
    topicsAI = null,
    language = null,
    macro_subject = null,
    context: classContext = null,
  } = req.body;

  try {
    if (!userId) return res.status(400).send("userId is required");
    if (!_id) return res.status(400).send("course _id is required");
    if (!title) return res.status(400).send("title is required");

    const course = await Course.findById(_id);
    if (!course) return res.status(404).send("Course not found");

    const flowsNotFound: string[] = [];
    const validFlows: string[] = [];

    for (const flowId of flowsId) {
      if (!flowId) continue;
      const exists = await Flow.exists({ _id: flowId });
      if (exists) {
        validFlows.push(flowId);
      } else {
        flowsNotFound.push(flowId);
      }
    }

    if (flowsNotFound.length > 0) {
      return res
        .status(404)
        .send("Flows not found: " + flowsNotFound.join(", "));
    }

    course.title = title;
    course.description = description;
    course.subjectArea = subjectArea;
    course.macro_subject = macro_subject;
    course.education_level = education_level;
    course.language = language;
    course.duration = duration;
    course.learningObjectives = learningObjectives;
    course.goals = goals;
    course.prerequisites = prerequisites;
    course.topics = topics;
    course.topicsAI = topicsAI;
    course.tags = tags;
    course.img = img;
    course.accessCode = accessCode;
    course.sourceMaterial = sourceMaterial;
    course.classContext = classContext;
    course.targetAudience = targetAudience;
    course.flowsId = validFlows;
    course.published = published;
    course.lastUpdate = new Date();

    await course.save();

    const updatedCourse = await Course.findById(course._id).populate("author");

    return res.status(200).json(updatedCourse);
  } catch (err) {
    console.error("Error updating course:", err);
    return res.status(500).send("Internal server error");
  }
}

export async function deleteCourse(req: Request, res: Response) {
  const courseId = req.params.id;
  const userId = req.user?._id;
  try {
    if (!userId) {
      return res.status(400).send("userId is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!courseId) {
      return res.status(404).send("courseId is required");
    }

    const dbcourse = await Course.findById(courseId);
    if (!dbcourse) {
      return res.status(404).send("Course not found");
    }

    //if (dbcourse.author !== userId && userId != "admin") {
    //  return res.status(403).send("You are not the author of this course");
    //}

    await Course.deleteOne({ _id: courseId });

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

    const resp = await Course.deleteMany();
    console.log(resp);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

export async function getCoursesById(req: Request, res: Response) {
  try {
    const courseId = req.params.id;

    if (!courseId) {
      return res.status(400).json({ error: "Missing course ID" });
    }

    const course = await Course.findById(courseId).lean();

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const flowIds = course.flowsId || [];
    const flows = await Flow.find({ _id: { $in: flowIds } }).lean();

    const courseWithFlows: PolyglotCourseWithFlow = {
      ...course,
      flows,
    };

    return res.json(courseWithFlows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCourses(req: Request, res: Response) {
  try {
    const q = req.query?.q?.toString();
    const me = req.query?.me?.toString();

    const query: any = q ? { title: { $regex: q, $options: "i" } } : {};

    if (me) {
      query["author._id"] = req.user?._id;
    }

    const courses = await Course.find(query).lean();

    const flowIds = courses.flatMap((course) => course.flowsId || []);

    const uniqueFlowIds = [...new Set(flowIds)];

    const flows = await Flow.find({ _id: { $in: uniqueFlowIds } }).lean();

    const coursesWithFlows: PolyglotCourseWithFlow[] = courses.map(
      (course) => ({
        ...course,
        flows: flows.filter((flow) => course.flowsId?.includes(flow._id)),
      }),
    );

    return res.json(coursesWithFlows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function createCourseJson(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const input = req.body;

    input.author = {
      _id: req.user?._id,
      username: req.user?.username,
    };

    const cleanedCourse = {
      ...input,
      _id: uuidv4(),
      lastUpdate: new Date(),
      published: false,
      nSubscribed: 0,
      nCompleted: 0,
    };

    const createdCourse = await Course.create(cleanedCourse);
    return res.status(200).send({ id: createdCourse._id });
  } catch (err: any) {
    console.error("Error creating course:", err);
    return res.status(500).send({
      error: "Internal Server Error during course creation",
      details: err.message || err,
    });
  }
}
