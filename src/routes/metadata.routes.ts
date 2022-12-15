import express from 'express';

import * as MetadataController from "../controllers/metadata.controller";
import { PolyglotNodeModel } from '../models/node.model';
import { PolyglotEdgeModel } from '../models/edge.models';

const router = express.Router();

router.route("/flow")
    .get(MetadataController.flowMetadata)

router.route("/node")
    .get(MetadataController.nodeMetadata)

router.route("/edge")
    .get(MetadataController.edgeMetadata)

router.route("/node/:type")
    .get(MetadataController.generalMetadata(PolyglotNodeModel))

router.route("/edge/:type")
    .get(MetadataController.generalMetadata(PolyglotEdgeModel))

export default router;