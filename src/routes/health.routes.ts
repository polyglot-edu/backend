import express from "express";

const router = express.Router();

// Liveness probe for the container orchestrator. Deliberately free of any
// database or auth dependency so a slow/absent Mongo doesn't fail the check.
router.get("/", (_req, res) => res.status(200).json({ status: "ok" }));

export default router;
