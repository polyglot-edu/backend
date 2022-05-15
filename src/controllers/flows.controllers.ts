import { Request, Response } from "express";
import { flows } from "../models/flow.model";
import { PolyglotFlow } from "../types";

/*
    Get flow by id
    @route GET /flows/:id
*/
export async function getFlowById(req: Request<{ id: string }>, res: Response<PolyglotFlow>) {
    // await param("id", "UUID v4 is required").isUUID(4).run(req);

    const flow = flows[req.params.id];
    if (!flow) {
        res.status(404).send();
        return;
    }
    res.send(flow);
}


/*
    Update flow with given id
    @route PUT /flows/:id
*/
export async function updateFlow(req: Request<{ id: string }>, res: Response) {
    // await param("id", "UUID v4 is required").isUUID(4).run(req);
    // TODO: FIXME: custom validation here for flow
    // await body("flow", "Flow is required").exists().run(req);

    const flow = flows[req.params.id];
    if (!flow) {
        res.status(404).send();
        return;
    }
    flows[req.params.id] = req.body;
    res.status(200).send();
}

export async function createFlow(req: Request<PolyglotFlow>, res: Response) {
    // TODO: add validation for flow
    const newFlow = req.body;

    if (flows[newFlow.id]) {
        res.status(409).send();
        return;
    }

    flows[newFlow.id] = newFlow;
    res.status(200).send({
        id: newFlow.id,
    });
}