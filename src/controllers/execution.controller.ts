import { Request, Response } from "express";
import { flows } from "../models/flow.model";
import { PolyglotNode } from "../types";

type GetInitialExerciseBody = { flowId: string }
export async function getInitialExercise(req: Request<{}, any, GetInitialExerciseBody>, res: Response) {
    const { flowId } = req.body;
    const currentFlow = flows[flowId];

    if (!currentFlow) {
        res.status(404).send();
        return;
    }

    const nodesWithIncomingEdges = new Set(currentFlow.edges.map(edge => currentFlow.nodes.find(node => node.reactFlow.id === edge.reactFlow.target)));
    const nodesWithoutIncomingEdges = currentFlow.nodes.filter(node => !nodesWithIncomingEdges.has(node));
    const firstNode = nodesWithoutIncomingEdges[Math.floor(Math.random() * nodesWithoutIncomingEdges.length)];

    if (!firstNode) {
        res.status(404).send();
        return;
    }

    const outgoingEdges = currentFlow.edges.filter(edge => edge.reactFlow.source === firstNode.reactFlow.id);

    const actualNode = {
        ...firstNode,
        validation: outgoingEdges.map(e => ({
            id: e.reactFlow.id,
            title: e.title,
            code: e.code,
            data: e.data,
            type: e.type,
        }))
    }

    res.status(200).json(actualNode);
}

let currentExercise: any = null;

type GetNextExerciseBody = {
    flowId: string;
    currentExerciseId: string;
    satisfiedConditions: string[];
}
export async function getNextExercise(req: Request<{}, any, GetNextExerciseBody>, res: Response) {
    const { flowId, satisfiedConditions } = req.body;
    const currentFlow = flows[flowId];

    if (!currentFlow) {
        res.status(404).send();
        return;
    }

    if (satisfiedConditions.length === 0) {
        res.status(200).json(currentExercise);
        return;
    }

    const satisfiedEdges = currentFlow.edges.filter(edge => satisfiedConditions.includes(edge.reactFlow.id));
    const possibleNextNodes = satisfiedEdges.map(edge => currentFlow.nodes.find(node => node.reactFlow.id === edge.reactFlow.target));
    const nextNode = possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];

    if (!nextNode) {
        res.status(404).send();
        return;
    }
    const outgoingEdges = currentFlow.edges.filter(edge => edge.reactFlow.source === nextNode.reactFlow.id);

    const actualNode = {
        ...nextNode,
        validation: outgoingEdges.map(e => ({
            id: e.reactFlow.id,
            title: e.title,
            code: e.code,
            data: e.data,
        }))
    }

    currentExercise = actualNode;
    res.status(200).json(actualNode);
}