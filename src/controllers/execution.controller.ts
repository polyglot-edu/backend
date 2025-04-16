import { NextFunction, Request, Response } from "express";
import PolyglotFlowModel from "../models/flow.model";
import { v4 } from "uuid";
import { ExecCtx, Execution } from "../execution/execution";
import { start } from "repl";
import { PolyglotNodeValidation } from "../types";

type SendCommandBody = {
  ctxId: string;
  cmd: string;
};

type StartExecutionBody = {
  flowId: string;
  userId?: string;
  username?: string;
};

type GetInitialExerciseBody = { flowId: string };

type GetNextExerciseV2Body = {
  ctxId: string;
  satisfiedConditions: string[];
  flowId?: string;
};

type ProgressBody = {
  ctxId: string;
  satisfiedConditions?: string[];
  flowId?: string;
  authorId: string;
};

type FlowCtxsBody = {
  flowId: string;
  userId: string;
};

const ctxs: { [x: string]: ExecCtx | undefined } = {
  prova: {
    gameId: "",
    flowId: "c509baaa-7ef1-4a5e-a868-3fcaac661eb0",
    userId: null,
    currentNodeId: "92ce9629-4ecc-4490-afa3-2e21b01af0d1",
    execNodeInfo: {},
  },
};

export async function sendCommand(
  req: Request<{}, any, SendCommandBody>,
  res: Response,
  next: NextFunction,
) {
  console.log("cmd: " + req.body.cmd);
  return res.status(200).json({});
}

// TODO: sometimes when you create a flow the editor sends malformed information like double nodes and edges and in backend it is not handled correctly

export async function startExecution(
  req: Request<{}, any, StartExecutionBody>,
  res: Response,
  next: NextFunction,
) {
  const { flowId, username, userId } = req.body;

  try {
    const flow = await PolyglotFlowModel.findById(flowId).populate([
      "nodes",
      "edges",
    ]);
    if (!flow) {
      return res.status(404).send();
    }

    const algo = flow?.execution?.algo ?? "Random Execution";

    // create execution obj
    const ctx = Execution.createCtx(flow._id, "");
    const execution = new Execution({ ctx, algo, flow });

    // get first available node
    const { ctx: updatedCtx, node: firstNode } = execution.getFirstExercise(
      username,
      userId,
    );

    if (!firstNode) {
      return res.status(404).send();
    }

    // create execution ctx id
    const ctxId = v4();

    // TODO: add to database
    ctxs[ctxId] = updatedCtx;

    return res.status(200).json({
      ctx: ctxId,
      platform: firstNode.platform,
    });
  } catch (err) {
    res.status(500).send(err);
  }
}

//return actualNode to execute
export async function getActualNode(
  req: Request<{}, any, GetNextExerciseV2Body>,
  res: Response,
  next: NextFunction,
) {
  const { ctxId } = req.body;
  try {
    const ctx = ctxs[ctxId];

    if (!ctx) {
      return res.status(400).json({ error: "Ctx not found!" });
    }

    const flow = await PolyglotFlowModel.findById(ctx.flowId).populate([
      "nodes",
      "edges",
    ]);

    if (!flow) return res.status(404).send();

    const algo = flow?.execution?.algo ?? "Random Execution";

    const execution = new Execution({ ctx, algo, flow });

    const actualNode = await execution.getActualNode(ctxId);

    if (!actualNode) {
      res.status(404).send();
      return;
    }
    const nodeData = { ...actualNode.node, flowId: ctx.flowId };
    return res.status(200).json(nodeData);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function getFlowCtxs(
  req: Request<{}, any, FlowCtxsBody>,
  res: Response,
  next: NextFunction,
) {
  const { flowId, userId } = req.body;
  try {
    const flow = await PolyglotFlowModel.findById(flowId).populate([
      "nodes",
      "edges",
    ]);

    if (!flow) return res.status(404).send();

    if (flow.author != userId && userId != "admin")
      res.status(400).send("You need to be the author to see the progress");

    // Utilizza Object.entries per ottenere un array di coppie [chiave, valore]
    const matchingEntries = Object.entries(ctxs).filter(([key, ctx]) =>
      ctx ? ctx.flowId === flowId : false,
    );

    const matchingCtxs = matchingEntries.map(([key, ctx]) => ({ ctx, key }));
    if (matchingCtxs) return res.status(200).send(matchingCtxs);
    return res.status(204).send("Any user found");
  } catch (err) {
    next(err);
  }
}
export async function resetExecution(
  req: Request<{}, any, ProgressBody>,
  res: Response,
  next: NextFunction,
) {
  const { ctxId, authorId } = req.body;

  try {
    const ctx = ctxs[ctxId];

    if (!ctx) {
      return res.status(400).json({ error: "Ctx not found!" });
    }

    const flow = await PolyglotFlowModel.findById(ctx.flowId).populate([
      "nodes",
      "edges",
    ]);

    if (!flow) return res.status(404).send();

    if (flow.author != authorId && authorId != "admin")
      res.status(400).send("You need to be the author to reset the progress");

    ctxs[ctxId] = undefined;

    return res.status(200).json("The user context had been canceled");
  } catch (err) {
    next(err);
  }
}

export async function progressExecution(
  req: Request<{}, any, ProgressBody>,
  res: Response,
  next: NextFunction,
) {
  const { ctxId, satisfiedConditions, authorId } = req.body;
  try {
    const ctx = ctxs[ctxId];

    if (!ctx) {
      return res.status(400).json({ error: "Ctx not found!" });
    }

    const flow = await PolyglotFlowModel.findById(ctx.flowId).populate([
      "nodes",
      "edges",
    ]);

    if (!flow) return res.status(404).send();

    if (flow.author != authorId && authorId != "admin")
      res.status(400).send("You need to be the author to unlock the progress");

    if (!satisfiedConditions)
      return res.status(404).send("Error satisfied conditions missing");

    if (satisfiedConditions.length === 0) return res.status(200).json(null);

    const algo = flow?.execution?.algo ?? "Random Execution";

    const execution = new Execution({ ctx, algo, flow });

    const { ctx: updatedCtx, node: firstNode } =
      await execution.getNextExercise(satisfiedConditions, ctxId);

    if (!firstNode) {
      res.status(404).send();
      return;
    }

    ctxs[ctxId] = updatedCtx;

    return res.status(200).json(firstNode);
  } catch (err) {
    next(err);
  }
}

export async function resetProgress(
  req: Request<{}, any, ProgressBody>,
  res: Response,
  next: NextFunction,
) {
  const { ctxId, satisfiedConditions, authorId } = req.body;
  try {
    const ctx = ctxs[ctxId];

    if (!ctx) {
      return res.status(400).json({ error: "Ctx not found!" });
    }

    const flow = await PolyglotFlowModel.findById(ctx.flowId).populate([
      "nodes",
      "edges",
    ]);

    if (!flow) return res.status(404).send();

    if (flow.author != authorId && authorId != "admin")
      res.status(400).send("You need to be the author to unlock the progress");

    //delete context with ctxId==ctx
    //idea: ctxs[ctxId] remove
    // Object.entries(ctxs).splice()

    return res.status(200).send("Execution resetted correctly");
  } catch (err) {
    next(err);
  }
}

export async function getNextExercisev2(
  req: Request<{}, any, GetNextExerciseV2Body>,
  res: Response,
  next: NextFunction,
) {
  const { ctxId, satisfiedConditions, flowId } = req.body;
  try {
    const ctx = ctxs[ctxId];

    if (!ctx) {
      return res.status(400).json({ error: "Ctx not found!" });
    }

    const flow = await PolyglotFlowModel.findById(ctx.flowId).populate([
      "nodes",
      "edges",
    ]);

    if (!flow) return res.status(404).send();
    if (satisfiedConditions.length === 0) return res.status(200).json(null);

    const algo = flow?.execution?.algo ?? "Random Execution";

    const execution = new Execution({ ctx, algo, flow });

    const { ctx: updatedCtx, node: firstNode } =
      await execution.getNextExercise(satisfiedConditions, ctxId);

    if (!firstNode) {
      res.status(404).send();
      return;
    }

    ctxs[ctxId] = updatedCtx;

    return res.status(200).json(firstNode);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function getInitialExercise(
  req: Request<{}, any, GetInitialExerciseBody>,
  res: Response,
  next: NextFunction,
) {
  const { flowId } = req.body;

  try {
    const flow = await PolyglotFlowModel.findById(flowId).populate([
      "nodes",
      "edges",
    ]);
    if (!flow) {
      return res.status(404).send();
    }

    const nodesWithIncomingEdges = new Set(
      flow.edges.map((edge) =>
        flow.nodes.find((node) => node.reactFlow.id === edge.reactFlow.target),
      ),
    );
    const nodesWithoutIncomingEdges = flow.nodes.filter(
      (node) => !nodesWithIncomingEdges.has(node),
    );
    const firstNode =
      nodesWithoutIncomingEdges[
        Math.floor(Math.random() * nodesWithoutIncomingEdges.length)
      ];

    if (!firstNode) {
      res.status(404).send();
      return;
    }

    const outgoingEdges = flow.edges.filter(
      (edge) => edge.reactFlow.source === firstNode.reactFlow.id,
    );

    const actualNode = {
      ...JSON.parse(JSON.stringify(firstNode)),
      validation: outgoingEdges.map((e) => ({
        id: e.reactFlow.id,
        title: e.title,
        code: e.code,
        data: e.data,
        type: e.type,
      })),
    };

    return res.status(200).json(actualNode);
  } catch (err) {
    res.status(500).send(err);
  }
}
type GetNextExerciseBody = {
  flowId: string;
  currentExerciseId: string;
  satisfiedConditions: string[];
};
export async function getNextExercise(
  req: Request<{}, any, GetNextExerciseBody>,
  res: Response,
  next: NextFunction,
) {
  const { flowId, satisfiedConditions } = req.body;

  try {
    const flow = await PolyglotFlowModel.findById(flowId).populate([
      "nodes",
      "edges",
    ]);
    if (!flow) {
      res.status(404).send();
      return;
    }

    if (satisfiedConditions.length === 0) {
      res.status(200).json(null);
      return;
    }

    const satisfiedEdges = flow.edges.filter((edge) =>
      satisfiedConditions.includes(edge.reactFlow.id),
    );
    const possibleNextNodes = satisfiedEdges.map((edge) =>
      flow.nodes.find((node) => node.reactFlow.id === edge.reactFlow.target),
    );
    const nextNode =
      possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];

    if (!nextNode) {
      res.status(404).send();
      return;
    }
    const outgoingEdges = flow.edges.filter(
      (edge) => edge.reactFlow.source === nextNode.reactFlow.id,
    );

    const actualNode = {
      ...JSON.parse(JSON.stringify(nextNode)),
      validation: outgoingEdges.map((e) => ({
        id: e.reactFlow.id,
        title: e.title,
        code: e.code,
        data: e.data,
        type: e.type,
      })),
    };

    return res.status(200).json(actualNode);
  } catch (err) {
    res.status(500).send(err);
  }
}
