import { NextFunction, Request, Response } from "express";
import PolyglotFlowModel from "../models/flow.model";
import { PolyglotFlow } from "../types/PolyglotFlow";
import { Document } from "mongoose";
import { PolyglotNodeModel } from "../models/node.model";
import { PolyglotEdge, PolyglotFlowInfo, PolyglotNode } from "../types";
import { PolyglotEdgeModel } from "../models/edge.models";
import { DOMAIN_APP_DEPLOY } from "../utils/secrets";

export async function deleteFlow(req: Request, res: Response, next: NextFunction) {
  try {
    const resp = await PolyglotFlowModel.deleteOne({_id: req.params.id, author: req.user?._id})
    console.log(resp);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
}

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

export async function downloadNotebookVSC(req: Request, res: Response, next: NextFunction) {
  const template = `#!csharp

#r "nuget: Polyglot.Interactive, 0.0.3-*"

#!csharp

#!polyglot-setup --flowid ${req.params.id} --serverurl http${DOMAIN_APP_DEPLOY.includes('localhost') ? '': 's'}://${DOMAIN_APP_DEPLOY}`

  const file = Buffer.from(template);
  res.setHeader('Content-Length', file.length);
  res.setHeader('Content-Disposition', `attachment; filename=notebook-${req.params.id}.dib`);
  res.write(file, 'binary');
  res.end();
}

//2nd version of notebook with ctx information
export async function downloadNotebookVSC2(req: Request, res: Response, next: NextFunction) {
  const template = `#!csharp

#r "nuget: Polyglot.Interactive, 0.0.3-*"

#!csharp

#!polyglot-setup --flowid ${req.params.id} --serverurl http${DOMAIN_APP_DEPLOY.includes('localhost') ? '': 's'}://${DOMAIN_APP_DEPLOY} --contextid ${req.params.ctxId}`

  const file = Buffer.from(template);
  res.setHeader('Content-Length', file.length);
  res.setHeader('Content-Disposition', `attachment; filename=notebook-${req.params.id}.dib`);
  res.write(file, 'binary');
  res.end();
}

// version of notebook with only ctx information
export async function downloadNotebookVSCCTX(req: Request, res: Response, next: NextFunction) {
  const template = `#!csharp

#r "nuget: Polyglot.Interactive, 0.0.3-*"

#!csharp

#!polyglot-setup --serverurl http${DOMAIN_APP_DEPLOY.includes('localhost') ? '': 's'}://${DOMAIN_APP_DEPLOY} --contextid ${req.params.ctxId}`

  const file = Buffer.from(template);
  res.setHeader('Content-Length', file.length);
  res.setHeader('Content-Disposition', `attachment; filename=notebook-${req.params.id}.dib`);
  res.write(file, 'binary');
  res.end();
}

/*
    Get all the flows FIX: refactor with auth
    @route GET /flows
*/
export async function getFlowList(req: Request, res: Response, next : NextFunction) {
  // await param("id", "UUID v4 is required").isUUID(4).run(req);

  try {
    const q = req.query?.q?.toString();
    const me = req.query?.me?.toString();
    // FIXME: create privacy policy in order to display only the right flows
    const query: any = q ? {title: {$regex: q, $options: "i"}} : {}
    if (me) {
      query.author = req.user?._id
    }
    const flows = await PolyglotFlowModel.find(query).populate('author','username')
    if (!flows) {
      return res.status(404).send();
    }
    return res.status(200).send(flows);
  } catch (err) {
    return next(err);
  }
  
}

export const updateFlowQuery = async (id: string, flow: PolyglotFlow & ({ nodes: PolyglotNode[], edges: PolyglotEdge[]} | { nodes: string[], edges: string[]})) => {
  const currentFlow = await PolyglotFlowModel
      .findOne({ _id: id})
      .populate('nodes', 'type')
      .populate('edges', 'type')

  if (!currentFlow) {
    console.log("Flow not found")
    return null;
  }

  const nodeIds: string[] = []
  const edgesIds: string[] = [];

  let nodes: {[k: string]: any} = {};
  if (PolyglotNodeModel.discriminators) {
    Object.keys(PolyglotNodeModel.discriminators).forEach((key) =>{
      nodes[key] = [];
    })
  }

  await Promise.all(flow.nodes?.map(async (obj: PolyglotNode) =>{
    if (currentFlow.nodes.filter((node: any) => node._id === obj._id).length && obj.type !== currentFlow.nodes.filter((node: any) => node._id === obj._id)[0].type) {
      await PolyglotNodeModel.findByIdAndDelete(obj._id);
    }
    if (obj._id) nodeIds.push(obj._id)
    nodes[obj.type].push({updateOne: {
      filter: { _id: obj._id || obj.reactFlow.id },
      update: obj,
      upsert: true,
    }});
  }) ?? [])

  await Promise.all(Object.keys(nodes).map(async (key: string)=>{
    try {
      const result = await PolyglotNodeModel.discriminators?.[key].bulkWrite(nodes[key], { ordered: false });
      if (result?.upsertedIds) nodeIds.push(...Object.keys(result?.upsertedIds).map((key) => result?.upsertedIds[+key]));
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
  await Promise.all(flow.edges?.map(async (obj: PolyglotEdge) =>{
    if (currentFlow.edges.filter((edge: any) => edge._id === obj._id).length && obj.type !== currentFlow.edges.filter((edge: any) => edge._id === obj._id)[0].type) {
      const result = await PolyglotEdgeModel.findByIdAndDelete(obj._id);
    }
    if (obj._id) edgesIds.push(obj._id);
    edges[obj.type].push({updateOne: {
      filter: { _id: obj._id || obj.reactFlow.id },
      update: obj,
      upsert: true,
    }});
  }) ?? [])

  await Promise.all(Object.keys(edges).map(async (key: string)=>{
    try {
      const result = await PolyglotEdgeModel.discriminators?.[key].bulkWrite(edges[key], { ordered: true });
      if (result?.upsertedIds) edgesIds.push(...Object.keys(result?.upsertedIds).map((key) => result?.upsertedIds[+key]));
    } catch(e) {
      console.log(e);
    }
  }));

  // FIX: controlla la bulkWrite per verificare la buona riuscita
  if (flow.nodes) {
    (flow as any).nodes = nodeIds;
  }
  
  if (flow.edges) {
    (flow as any).edges = edgesIds;
  }
  
  return await PolyglotFlowModel.findByIdAndUpdate(flow._id, flow, {new: true});
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
      req.body.publish=false;
      const flow = await updateFlowQuery(req.params.id, req.body);

      if (!flow) {
        return res.status(404).send()
      }

      return res.status(200).send(flow);
    } catch (err) {
      return next(err);
    }
    
}

//function to publish the flow (change publish to true)
export async function publishFlow(req: Request, res: Response, next : NextFunction) {
  
  try {

    req.body.publish=true;

    const flows = await updateFlowQuery(req.params.id, req.body);

    if (!flows) {
      return res.status(404).send()
    }

    return res.status(200).send(flows);
  } catch (err) {
    return next(err);
  }
  
}

export async function createFlow(req: Request, res: Response, next : NextFunction) {
  try {
    const newFlow = req.body as PolyglotFlowInfo;
    newFlow.author = req.user?._id;

    const flow =  await PolyglotFlowModel.create(newFlow);
    return res.status(200).send(flow);
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

export async function createFlowJson(req: Request, res: Response, next : NextFunction) {
    try {
      const input = req.body as PolyglotFlowInfo & {nodes: PolyglotNode[], edges: PolyglotEdge[]};
      input.author = req.user?._id;

      const filtered = JSON.parse(JSON.stringify(input));
      filtered.nodes = [];
      filtered.edges = [];
      delete filtered['_id'];

      const flow =  await PolyglotFlowModel.create(filtered);
      input._id = flow._id;
      const newFlow = await updateFlowQuery(flow._id, input);
      if (!newFlow) return res.status(500).json({"error": "internal error"})
    
      return res.status(200).send({id: newFlow?._id});
    } catch (err) {
      console.log(err);
      return next(err);
    }
}