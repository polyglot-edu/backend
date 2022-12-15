import { NextFunction, Request, Response } from "express";
import PolyglotFlowModel from "../models/flow.model";

export async function autocomplete(req: Request, res: Response, next: NextFunction) {
  try {
    const q = req.query?.q?.toString();
    const me = req.query?.me?.toString();
    // FIXME: create privacy policy in order to display only the right flows
    const query: any = q ? {title: {$regex: q, $options: "i"}} : {}
    if (me) {
      query.author = req.user?._id
    }
    const suggestions = await PolyglotFlowModel
      .find(query)
      .limit(10)
      .select('title -_id')
      .distinct('title');
    return res.status(200).send(suggestions);
  } catch(err) {
    return next(err);
  }
}