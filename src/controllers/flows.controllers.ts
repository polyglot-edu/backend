import { Request, Response } from "express";
import { body, param } from "express-validator";
import { PolyglotFlow } from "../types";

let flows: { [id: string]: PolyglotFlow } = {
    "654251f1-a660-46ec-9294-5d92eabf6704": {
        id: "654251f1-a660-46ec-9294-5d92eabf6704",
        nodes: [
            {
                type: "start",
                title: "Start",
                description: "Start",
                difficulty: 0,
                data: {},
                reactFlow: {}
            }
        ],
        edges: []
    }
}

/*
    Get flow by id
    @route GET /flows/:id
*/
export async function getFlowById(req: Request<{ id: string }>, res: Response<PolyglotFlow>) {
    await param("id", "UUID v4 is required").isUUID(4).run(req);

    const flow = flows[req.params.id];
    if (!flow) {
        res.status(404).send();
        return;
    }
    res.send(flow);
}

export async function updateFlow(req: Request<{ id: string }>, res: Response) {
    // await param("id", "UUID v4 is required").isUUID(4).run(req);
    // TODO: FIXME: custom validation here for flow
    // await body("flow", "Flow is required").exists().run(req);

    console.log(req.params)
    console.log(req.body)

    const flow = flows[req.params.id];
    if (!flow) {
        res.status(404).send();
        return;
    }
    flows[req.params.id] = req.body;
    res.status(200).send();
}

export async function createFlow(req: Request, res: Response) {
    res.status(404).json({ msg: "Not implemented" });
    // throw new Error('Method not implemented.');
}