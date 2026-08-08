import { NextFunction, Request, Response } from "express";
import ApiKey from "../models/apiKey.model";
import { generateApiKey } from "../utils/apiKeys";

/** Shape returned to the client. Never includes the hash. */
const present = (k: any) => ({
  _id: k._id,
  name: k.name,
  display: k.display,
  createdAt: k.createdAt,
  lastUsedAt: k.lastUsedAt ?? null,
  expiresAt: k.expiresAt ?? null,
  revokedAt: k.revokedAt ?? null,
});

/**
 * POST /api/user/apikeys
 *
 * Returns the plaintext token exactly once — it is not recoverable afterwards,
 * because only its hash is stored.
 */
export async function createApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const name = (req.body?.name ?? "").toString().trim();
    if (!name) return res.status(400).json({ error: "`name` is required" });

    let expiresAt: Date | undefined;
    if (req.body?.expiresInDays !== undefined) {
      const days = Number(req.body.expiresInDays);
      if (!Number.isFinite(days) || days <= 0)
        return res
          .status(400)
          .json({ error: "`expiresInDays` must be a positive number" });
      expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }

    const { token, hash, display } = generateApiKey();

    const record = await ApiKey.create({
      user: userId,
      name,
      hash,
      display,
      createdAt: new Date(),
      expiresAt,
    });

    return res.status(201).json({
      ...present(record),
      token,
      warning: "Store this token now — it cannot be retrieved again.",
    });
  } catch (error) {
    next(error);
  }
}

/** GET /api/user/apikeys — metadata only, never the token. */
export async function listApiKeys(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const keys = await ApiKey.find({ user: userId }).sort({ createdAt: -1 });
    return res.json(keys.map(present));
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/user/apikeys/:id
 *
 * Soft delete: the record is kept with `revokedAt` set, so the audit trail
 * survives and the hash cannot be reissued.
 */
export async function revokeApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    // Scoped by user so one account cannot revoke another's key.
    const record = await ApiKey.findOne({ _id: req.params.id, user: userId });
    if (!record) return res.status(404).json({ error: "API key not found" });

    if (!record.revokedAt) {
      record.revokedAt = new Date();
      await record.save();
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}
