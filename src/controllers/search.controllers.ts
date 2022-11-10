import { NextFunction, Request, Response } from "express";
import PolyglotFlowModel from "../models/flow.model";

export async function autocomplete(req: Request, res: Response, next: NextFunction) {
  const query = req.query?.q?.toString();

  try {
    const suggestions = await PolyglotFlowModel
      .find({title: {$regex: query, $options: "i"}})
      .select('title -_id')
      .distinct('title');
    return res.status(200).send(suggestions);
  } catch(err) {
    return next(err);
  }
}