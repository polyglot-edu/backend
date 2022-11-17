import { NextFunction, Request, Response } from "express";
import PolyglotFlowModel from "../models/flow.model";
import { PolyglotFlow } from "../types/PolyglotFlow";
import { Document } from "mongoose";
import { MultipleChoiceQuestionNode, PolyglotNodeModel } from "../models/node.model";
import { PolyglotEdge, PolyglotNode } from "../types";
import { PolyglotEdgeModel } from "../models/edge.models";

/*
    Get flow by id
    @route GET /flows/:id
*/
export async function getFlowById(req: Request, res: Response<Document<unknown, any, PolyglotFlow> & PolyglotFlow>, next : NextFunction) {
    // await param("id", "UUID v4 is required").isUUID(4).run(req);

    try {
      const flow = await PolyglotFlowModel
        .findById(req.params.id)
        .populate("nodes")
        .populate("edges");
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
    const flows = await PolyglotFlowModel.find({title: {$regex: req.query?.q?.toString(), $options: "i"}})
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
      const flow = await PolyglotFlowModel.findOne({ _id: req.params.id})
      if (!flow) {
        return res.status(404).send()
      }

      let nodes: {[k: string]: any} = {};
      if (PolyglotNodeModel.discriminators) {
        Object.keys(PolyglotNodeModel.discriminators).forEach((key) =>{
          nodes[key] = [];
        })
      }
      req.body.nodes.forEach((obj: PolyglotNode) =>{
        nodes[obj.type].push({updateOne: {
          filter: { _id: obj._id },
          update: obj,
          upsert: true,
        }});
      })

      Object.keys(nodes).forEach(async (key: string)=>{
        try {
          await PolyglotNodeModel.discriminators?.[key].bulkWrite(nodes[key], { ordered: true });
        } catch (e) {
          console.log(e);
        }
        
      })

      let edges: {[k: string]: any} = {};
      if (PolyglotEdgeModel.discriminators) {
        Object.keys(PolyglotEdgeModel.discriminators).forEach((key) =>{
          edges[key] = [];
        })
      }
      req.body.edges.forEach((obj: PolyglotEdge) =>{
        edges[obj.type].push({updateOne: {
          filter: { _id: obj._id },
          update: obj,
          upsert: true,
        }});
      })

      Object.keys(edges).forEach(async (key: string)=>{
        try {
          await PolyglotEdgeModel.discriminators?.[key].bulkWrite(edges[key], { ordered: true });
        } catch(e) {
          console.log(e);
        }
      })

      // FIX: controlla la bulkWrite per verificare la buona riuscita
      flow.nodes = req.body.nodes.map((val: PolyglotNode) => val._id);
      flow.edges = req.body.edges.map((val: PolyglotEdge) => val._id);
      const newFlow = await flow.save();

      return res.status(200).send(newFlow);
    } catch (err) {
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