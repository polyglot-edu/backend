import { NextFunction, Request, Response } from "express";
import { PolyglotConceptMap } from "../types/PolyglotConcept";
import { PolyglotConceptMapModel } from "../models/concept.models";

type CreateConceptMapBody = PolyglotConceptMap
export async function createConceptMap(req: Request<{}, any, CreateConceptMapBody>, res: Response, next: NextFunction) {
  const conceptMap = req.body;

  try {
    const polyglotConceptMap = await PolyglotConceptMapModel.create(conceptMap);

    return res.status(200).json(polyglotConceptMap);
  } catch (err) {
    next(err);
  }
}

export async function findConceptMapById(req: Request, res: Response, next: NextFunction) {
  const conceptMapId = req.params.id;

  try {
    const conceptMap = await PolyglotConceptMapModel.findById(conceptMapId);

    return res.status(200).json(conceptMap);
  } catch (err) {
    next(err);
  }
}
