import { PolyglotFlow } from "../types";
import sampleData from "../exampleFlow.json";
import sampleAbstract from "../exampleAbstract.json";

export const flows: { [id: string]: PolyglotFlow } = {
    "654251f1-a660-46ec-9294-5d92eabf6704": {
        id: "654251f1-a660-46ec-9294-5d92eabf6704",
        title: "Example Flow",
        description: "This is an example flow",
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
    },
}

flows[sampleData.id] = sampleData;
flows[sampleAbstract.id] = sampleAbstract;