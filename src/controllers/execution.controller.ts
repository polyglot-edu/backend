import { NextFunction, Request, Response } from "express";
import PolyglotFlowModel from "../models/flow.model";
import demoExample from "../demoFlow.json"

type GetInitialExerciseBody = { flowId: string }
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