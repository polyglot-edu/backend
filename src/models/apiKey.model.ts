import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

export type ApiKeyDocument = Document & {
  _id: string;
  user: string;
  name: string;
  hash: string;
  display: string;
  createdAt: Date;
  lastUsedAt?: Date;
  expiresAt?: Date;
  revokedAt?: Date;
};

const apiKeySchema = new mongoose.Schema<ApiKeyDocument>({
  _id: {
    type: String,
    required: true,
    default: () => uuidv4(),
    validate: {
      validator: (id: string) => validator.isUUID(id),
      message: "Invalid UUID-v4",
    },
  },
  user: { type: String, required: true, ref: "User", index: true },
  // Human label, so a user can tell their keys apart when revoking one.
  name: { type: String, required: true },
  // SHA-256 of the token. Unique so a lookup by hash is an indexed point query.
  hash: { type: String, required: true, unique: true, index: true },
  // Truncated plaintext prefix, e.g. `pgk_A1b2c3…`, for display only.
  display: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  // Throttled to at most one write per hour — see auth.middleware.ts.
  lastUsedAt: { type: Date },
  // Optional. Absent means the key does not expire.
  expiresAt: { type: Date },
  // Soft delete: revoked keys are kept so the audit trail survives.
  revokedAt: { type: Date },
});

const ApiKey = mongoose.model<ApiKeyDocument>("ApiKey", apiKeySchema);

export default ApiKey;
