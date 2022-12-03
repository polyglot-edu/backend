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
    const q = req.query?.q?.toString();
    // FIXME: create privacy policy in order to display only the right flows
    const query = q ? {title: {$regex: q, $options: "i"}} : {}
    const flows = await PolyglotFlowModel.find(query).populate('author','username')
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
      const flow = await PolyglotFlowModel
        .findOne({ _id: req.params.id})
        .populate('nodes', 'type')
        .populate('edges', 'type')
      if (!flow) {
        return res.status(404).send()
      }

      let nodes: {[k: string]: any} = {};
      if (PolyglotNodeModel.discriminators) {
        Object.keys(PolyglotNodeModel.discriminators).forEach((key) =>{
          nodes[key] = [];
        })
      }
    
      await Promise.all(req.body.nodes.map(async (obj: PolyglotNode) =>{
        if (flow.nodes.filter(node => node._id === obj._id).length && obj.type !== flow.nodes.filter(node => node._id === obj._id)[0].type) {
          console.log("delete")
          console.log(obj);
          const result = await PolyglotNodeModel.findByIdAndDelete(obj._id);
          console.log("after")
          console.log(result)
        }
        nodes[obj.type].push({updateOne: {
          filter: { _id: obj._id },
          update: obj,
          upsert: true,
        }});
      }))

      await Promise.all(Object.keys(nodes).map(async (key: string)=>{
        try {
          const resp = await PolyglotNodeModel.discriminators?.[key].bulkWrite(nodes[key], { ordered: false });
          console.log("no error");
          console.log(resp);
        } catch (e) {
          console.log(e);
        }
      }))

      let edges: {[k: string]: any} = {};
      if (PolyglotEdgeModel.discriminators) {
        Object.keys(PolyglotEdgeModel.discriminators).forEach((key) =>{
          edges[key] = [];
        })
      }
      await Promise.all(req.body.edges.map(async (obj: PolyglotEdge) =>{
        if (flow.edges.filter(edge => edge._id === obj._id).length && obj.type !== flow.edges.filter(edge => edge._id === obj._id)[0].type) {
          console.log("delete")
          console.log(obj);
          const result = await PolyglotEdgeModel.findByIdAndDelete(obj._id);
          console.log("after")
          console.log(result)
        }
        edges[obj.type].push({updateOne: {
          filter: { _id: obj._id },
          update: obj,
          upsert: true,
        }});
      }))

      await Promise.all(Object.keys(edges).map(async (key: string)=>{
        try {
          await PolyglotEdgeModel.discriminators?.[key].bulkWrite(edges[key], { ordered: true });
        } catch(e) {
          console.log(e);
        }
      }))

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
    const newFlow = req.body as PolyglotFlow;
    newFlow.author = req.user?._id

    try {
      const flow =  await PolyglotFlowModel.create(newFlow);
      return res.status(200).send({id: flow._id});
    } catch (err) {
      return next(err);
    }
}