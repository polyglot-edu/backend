import { Request, Response } from "express";
import { flows } from "../models/flow.model";

type GetNextExerciseBody = {
    id: string;
    satisfiedConditions: string[];
}
export async function getNextExercise(req: Request<{}, any, GetNextExerciseBody>, res: Response) {
    const { id, satisfiedConditions } = req.body;
    const currentFlow = flows[id];

    if (!currentFlow) {
        res.status(404).send();
        return;
    }


    const satisfiedEdges = currentFlow.edges.filter(edge => satisfiedConditions.includes(edge.reactFlow.id));
    const possibleNextNodes = satisfiedEdges.map(edge => currentFlow.nodes[edge.reactFlow.target]);
    const nextNode = possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];

    // console.log(JSON.stringify(satisfiedEdges, null, 2))
    if (!nextNode) {
        res.status(404).send();
        return;
    }

    res.status(200).json(nextNode);
}