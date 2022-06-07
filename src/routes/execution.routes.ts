import express from 'express';
import * as ExecutionController from "../controllers/execution.controller";
import { Request } from "express";
import * as flow from "../exampleFlow.json";

const router = express.Router();

router.post("/next", ExecutionController.getNextExercise)
router.post("/first", ExecutionController.getInitialExercise)


/**
 * ALEXA TEST API
 */
router.post("/alexa/next", async (req, res) => {
    const satisfiedConditions = flow.edges.map(e => e.reactFlow.id);
    const currentFlow = flow;

    const satisfiedEdges = currentFlow.edges.filter(edge => satisfiedConditions.includes(edge.reactFlow.id));
    const possibleNextNodes = satisfiedEdges.map(edge => currentFlow.nodes.find(node => node.reactFlow.id === edge.reactFlow.target)).filter(n => n?.type === "multipleChoiceQuestionNode");
    const nextNode = possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];

    if (!nextNode) {
        res.status(404).send();
        return;
    }
    const outgoingEdges = currentFlow.edges.filter(edge => edge.reactFlow.source === nextNode.reactFlow.id);

    
    const actualNode = {
        title: nextNode.title,
        description: nextNode.description,
        question: nextNode.data.question ?? "",
        choices: nextNode.data.choices ?? [],
    }

    res.status(200).json(actualNode);
})

type AlexaSubmitRequestBody = {
    answer: string;
}
router.post("/alexa/submit", async (req: Request<{}, any, AlexaSubmitRequestBody>, res) => {
    console.log(req.body.answer);
    let statusAnswer = req.body.answer !== "" ? 200 : 500;
    console.log(statusAnswer)
    res.status(statusAnswer).send();
})

export default router;