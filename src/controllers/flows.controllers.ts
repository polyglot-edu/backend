import { NextFunction, Request, Response } from "express";
import PolyglotFlowModel from "../models/flow.model";
import { PolyglotFlow } from "../types/PolyglotFlow";
import { Document } from "mongoose";

/*
    Get flow by id
    @route GET /flows/:id
*/
export async function getFlowById(req: Request, res: Response<Document<unknown, any, PolyglotFlow> & PolyglotFlow>, next : NextFunction) {
    // await param("id", "UUID v4 is required").isUUID(4).run(req);

    try {
      const flow = await PolyglotFlowModel.findById(req.params.id)
      if (!flow) {
        return res.status(404).send();
      }
      return res.status(200).send(flow);
    } catch (err) {
      return next(err);
    }
    
}

/*
    Get all the flows FIX: refactor with auth
    @route GET /flows
*/
export async function getFlowList(req: Request, res: Response, next : NextFunction) {
  // await param("id", "UUID v4 is required").isUUID(4).run(req);

  try {
    const flows = await PolyglotFlowModel.find({})
    if (!flows) {
      return res.status(404).send();
    }
    return res.status(200).send(flows);
  } catch (err) {
    return next(err);
  }
  
}


/*
    Update flow with given id
    @route PUT /flows/:id
*/
export async function updateFlow(req: Request, res: Response, next: NextFunction) {
    // await param("id", "UUID v4 is required").isUUID(4).run(req);
    // TODO: FIXME: custom validation here for flow
    // await body("flow", "Flow is required").exists().run(req);

    try {
      const flow = await PolyglotFlowModel.updateOne({
        _id: req.params.id
      },req.body)
      if (!flow) {
        return res.status(404).send()
      }
      return res.status(200).send();
    } catch(err) {
      return next(err);
    }
    
}

export async function createFlow(req: Request, res: Response, next : NextFunction) {
    // TODO: add validation for flow
    const newFlow = req.body;

    try {
      const flow =  await PolyglotFlowModel.create(newFlow);
      return res.status(200).send({id: flow._id});
    } catch (err) {
      return next(err);
    }
}