import express from 'express';
import * as ExecutionController from "../controllers/execution.controller";
import { Request } from "express";
import * as flow from "../exampleFlow.json";
import { PolyglotNode } from '../types';

const router = express.Router();

router.post("/next", ExecutionController.getNextExercise)
router.post("/first", ExecutionController.getInitialExercise)


/**
 * ALEXA TEST API
 */
let lastExercise: PolyglotNode | null = null
router.post("/alexa/next", async (req, res) => {
    const satisfiedConditions = flow.edges.map(e => e.reactFlow.id);
    const currentFlow = flow;

    const satisfiedEdges = currentFlow.edges.filter(edge => satisfiedConditions.includes(edge.reactFlow.id));
    const possibleNextNodes = satisfiedEdges.map(edge => currentFlow.nodes.find(node => node.reactFlow.id === edge.reactFlow.target)).filter(n => n?.type === "multipleChoiceQuestionNode" || n?.type === "lessonNode");
    const nextNode = possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];

    if (!nextNode) {
        res.status(404).send();
        return;
    }
    
    if (nextNode.type === "multipleChoiceQuestionNode") {
        lastExercise = nextNode;
        
        const actualNode = {
            text: `${nextNode.data.question ?? ""}. ${nextNode.data.choices?.join(". ") ?? ""}`,
            data: {
                "expectAnswer": true
            }
        }
        
        res.status(200).json(actualNode);
    } else if (nextNode.type === "lessonNode") {
        lastExercise = nextNode;

        const actualNode = {
            text: `some example lesson text from a pdf`,
            data: {
                "expectAnswer": false
            }
        }

        res.status(200).json(actualNode);
    }
})

type AlexaSubmitRequestBody = {
    answer?: string;
}
router.post("/alexa/submit", async (req: Request<{}, any, AlexaSubmitRequestBody>, res) => {
    if(lastExercise?.type === "multipleChoiceQuestionNode") {
        let hasAnswer = req.body.answer !== undefined ? 200 : 400;
        if (hasAnswer === 200) {
            res.status(hasAnswer).json({ "result": Math.random() > 0.5 ? "Not correct" : "Great job!"  });
        } else {
            res.status(hasAnswer).send();
        }
    } else if (lastExercise?.type === "lessonNode") {
        res.status(200).json({ "result": "Lesson done" });
    }
})

export default router;