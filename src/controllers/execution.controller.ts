import { NextFunction, Request, Response } from "express";
import PolyglotFlowModel from "../models/flow.model";
import { v4 } from "uuid";
import { ExecCtx, Execution } from "../execution/execution";
import { start } from "repl";

type SendCommandBody = {
  ctxId: string;
  cmd: string;
}

type StartExecutionBody = {
  flowId: string;
}

type GetInitialExerciseBody = { flowId: string }

type GetNextExerciseV2Body = {
  ctxId: string;
  satisfiedConditions: string[];
  flowId?: string;
}

const ctxs: {[x: string] : ExecCtx} = {
  prova: {
    gameId: "",
    flowId: "c509baaa-7ef1-4a5e-a868-3fcaac661eb0",
    userId: null,
    currentNodeId: "92ce9629-4ecc-4490-afa3-2e21b01af0d1",
    execNodeInfo: {}
  }
}

export async function sendCommand(req: Request<{},any,SendCommandBody>, res: Response, next: NextFunction) {
  console.log("cmd: " + req.body.cmd);
  return res.status(200).json({});
}

// TODO: sometimes when you create a flow the editor sends malformed information like double nodes and edges and in backend it is not handled correctly

export async function startExecution(req: Request<{},any,StartExecutionBody>, res: Response, next: NextFunction) {
  const {flowId} = req.body;

  try {
    const flow = await PolyglotFlowModel.findById(flowId).populate(["nodes","edges"]);
    if (!flow) {
      return res.status(404).send();
    }

    const algo = flow?.execution?.algo ?? "Random Execution";

    // create execution obj
    const ctx = Execution.createCtx(flow._id, "");
    const execution = new Execution({ctx, algo, flow});

    // get first available node
    const {ctx: updatedCtx, node: firstNode} = execution.getFirstExercise();

    if (!firstNode) {
      return res.status(404).send()
    }

    // create execution ctx id
    const ctxId = v4();

    // TODO: add to database
    ctxs[ctxId] = updatedCtx; 

    return res.status(200).json({
      ctx: ctxId,
      platform: firstNode.platform
    })
  } catch(err) {
    next(err);
  }


}

//return actualNode to execute
export async function getActualNode(req: Request<{},any, GetNextExerciseV2Body>, res: Response, next: NextFunction) {
  const { ctxId, } = req.body;
  try {

    const ctx = ctxs[ctxId];

    if (!ctx) {
      return res.status(400).json({"error": "Ctx not found!"})
    }
    
    const flow = await PolyglotFlowModel.findById(ctx.flowId).populate(["nodes","edges"]);
    
    if (!flow) return res.status(404).send();
    
    const algo = flow?.execution?.algo ?? "Random Execution";

    const execution = new Execution({ctx, algo, flow});

    const actualNode = await execution.getActualNode();

    if (!actualNode) {
        res.status(404).send();
        return;
    }

    return res.status(200).json(actualNode.node);
  }catch(err) {
    next(err);
  }
}

export async function getNextExercisev2(req: Request<{},any, GetNextExerciseV2Body>, res: Response, next: NextFunction) {
  const { ctxId, satisfiedConditions, flowId } = req.body;
  try {

    const ctx = ctxs[ctxId];

    if (!ctx) {
      return res.status(400).json({"error": "Ctx not found!"})
    }
    
    const flow = await PolyglotFlowModel.findById(ctx.flowId).populate(["nodes","edges"]);
    
    if (!flow) return res.status(404).send();
    if (satisfiedConditions.length === 0) return res.status(200).json(null);

    const algo = flow?.execution?.algo ?? "Random Execution";

    const execution = new Execution({ctx, algo, flow});

    const {ctx: updatedCtx, node: firstNode} = await execution.getNextExercise(satisfiedConditions);

    if (!firstNode) {
        res.status(404).send();
        return;
    }

    ctxs[ctxId] = updatedCtx;

    return res.status(200).json(firstNode);
  }catch(err) {
    next(err);
  }
}

export async function getInitialExercise(req: Request<{}, any, GetInitialExerciseBody>, res: Response, next: NextFunction) {
    const { flowId } = req.body;

    try {
      const flow = await PolyglotFlowModel.findById(flowId).populate(["nodes","edges"]);
      if (!flow) {
        return res.status(404).send();
      }

      const nodesWithIncomingEdges = new Set(flow.edges.map(edge => flow.nodes.find(node => node.reactFlow.id === edge.reactFlow.target)));
      const nodesWithoutIncomingEdges = flow.nodes.filter(node => !nodesWithIncomingEdges.has(node));
      const firstNode = nodesWithoutIncomingEdges[Math.floor(Math.random() * nodesWithoutIncomingEdges.length)];

      if (!firstNode) {
          res.status(404).send();
          return;
      }

      const outgoingEdges = flow.edges.filter(edge => edge.reactFlow.source === firstNode.reactFlow.id);

      const actualNode = {
          ...JSON.parse(JSON.stringify(firstNode)),
          validation: outgoingEdges.map(e => ({
              id: e.reactFlow.id,
              title: e.title,
              code: e.code,
              data: e.data,
              type: e.type,
          }))
      }

      return res.status(200).json(actualNode);
    }catch(err) {
      next(err);
    }
}
type GetNextExerciseBody = {
    flowId: string;
    currentExerciseId: string;
    satisfiedConditions: string[];
}
export async function getNextExercise(req: Request<{}, any, GetNextExerciseBody>, res: Response, next: NextFunction) {
    const { flowId, satisfiedConditions } = req.body;

    try {
      const flow = await PolyglotFlowModel.findById(flowId).populate(["nodes","edges"]);
      if (!flow) {
        res.status(404).send();
        return;
      }

      if (satisfiedConditions.length === 0) {
        res.status(200).json(null);
        return;
      }

      const satisfiedEdges = flow.edges.filter(edge => satisfiedConditions.includes(edge.reactFlow.id));
      const possibleNextNodes = satisfiedEdges.map(edge => flow.nodes.find(node => node.reactFlow.id === edge.reactFlow.target));
      const nextNode = possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];

      if (!nextNode) {
          res.status(404).send();
          return;
      }
      const outgoingEdges = flow.edges.filter(edge => edge.reactFlow.source === nextNode.reactFlow.id);

      const actualNode = {
          ...JSON.parse(JSON.stringify(nextNode)),
          validation: outgoingEdges.map(e => ({
              id: e.reactFlow.id,
              title: e.title,
              code: e.code,
              data: e.data,
              type: e.type,
          }))
      }

      return res.status(200).json(actualNode);
    }catch(err) {
      next(err);
    }
}