import mongoose, { Schema, model, Document } from "mongoose";
import * as Types from "../types/LearningData";

const options = { discriminatorKey: "type" };

//Interfacce per Mongoose
export interface BaseActionDocument extends Types.BaseAction, Document {}
export interface RegistrationToWorkAdventureActionDocument
  extends Types.RegistrationToWorkAdventureAction,
    Document {}
export interface LogInToWorkAdventureActionDocument
  extends Types.LogInToWorkAdventureAction,
    Document {}
export interface LogOutToWorkAdventureActionDocument
  extends Types.LogOutToWorkAdventureAction,
    Document {}
export interface LogInToPolyGloTActionDocument
  extends Types.LogInToPolyGloTAction,
    Document {}
export interface LogOutToPolyGloTActionDocument
  extends Types.LogOutToPolyGloTAction,
    Document {}
export interface OpenToolActionDocument
  extends Types.OpenToolAction,
    Document {}
export interface CloseToolActionDocument
  extends Types.CloseToolAction,
    Document {}
export interface OpenNodeActionDocument
  extends Types.OpenNodeAction,
    Document {}
export interface CloseNodeActionDocument
  extends Types.CloseNodeAction,
    Document {}
export interface ChangeNodeActionDocument
  extends Types.ChangeNodeAction,
    Document {}
export interface OpenLPInfoActionDocument
  extends Types.OpenLPInfoAction,
    Document {}
export interface CloseLPInfoActionDocument
  extends Types.CloseLPInfoAction,
    Document {}
export interface SearchForLPActionDocument
  extends Types.SearchForLPAction,
    Document {}
export interface ShowLPActionDocument
  extends Types.ShowLPAction,
    Document {}
export interface SelectLPActionDocument
  extends Types.SelectLPAction,
    Document {}
export interface RemoveLPSelectionActionDocument
  extends Types.RemoveLPSelectionAction,
    Document {}
export interface CreateLPActionDocument
  extends Types.CreateLPAction,
    Document {}
export interface ModifyLPActionDocument
  extends Types.ModifyLPAction,
    Document {}
export interface DeleteLPActionDocument
  extends Types.DeleteLPAction,
    Document {}
export interface SubmitAnswerActionDocument
  extends Types.SubmitAnswerAction,
    Document {}
export interface GradeActionDocument
  extends Types.GradeAction,
    Document {}

//Schema base
export const baseActionSchema = new Schema(
  {
    timestamp: { type: Date, required: true },
    userId: { type: String, required: true },
    actionType: { type: String, required: true },
    zoneId: { type: String, required: true, enum: Object.values(Types.ZoneId) },
    platform: {
      type: String,
      required: true,
      enum: Object.values(Types.Platform),
    },
    action: { type: Schema.Types.Mixed, default: null }, //Accettabile? Mi serve per poter filtrare usando i campi contenuti in action. Possibile sostituire con discriminatori e sistemare i find.
  },
  options,
);

//Schemi specifici
export const registrationToWorkAdventureActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      userRole: {
        type: String,
        required: true,
        enum: Object.values(Types.UserRole),
      },
    },
  },
  options,
);

export const logInToWorkAdventureActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      userRole: {
        type: String,
        required: true,
        enum: Object.values(Types.UserRole),
      },
    },
  },
  options,
);

export const logOutToWorkAdventureActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      userRole: {
        type: String,
        required: true,
        enum: Object.values(Types.UserRole),
      },
    },
  },
  options,
);

export const logInToPolyGloTActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      userRole: {
        type: String,
        required: true,
        enum: Object.values(Types.UserRole),
      },
    },
  },
  options,
);

export const logOutToPolyGloTActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      userRole: {
        type: String,
        required: true,
        enum: Object.values(Types.UserRole),
      },
    },
  },
  options,
);

export const openToolActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      //?
    },
  },
  options,
);

export const closeToolActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      //?
    },
  },
  options,
);

export const openNodeActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
      nodeId: { type: String, required: true },
      activity: { type: String, required: true },
    },
  },
  options,
);

export const closeNodeActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
      nodeId: { type: String, required: true },
      activity: { type: String, required: true },
    },
  },
  options,
);

export const changeNodeActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
      oldNodeId: { type: String, required: true },
      newNodeId: { type: String, required: true },
    },
  },
  options,
);

export const openLPInfoActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
    },
  },
  options,
);

export const closeLPInfoActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
    },
  },
  options,
);

export const searchForLPActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      queryId: { type: String, required: true },
      queryText: { type: String, required: true },
    },
  },
  options,
);

export const showLPActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      queryId: { type: String, required: true },
      resultId: { type: [String], required: true },
    },
  },
  options,
);

export const selectLPActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
    },
  },
  options,
);

export const removeLPSelectionActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
    },
  },
  options,
);

export const createLPActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
    },
  },
  options,
);

export const modifyLPActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
    },
  },
  options,
);

export const deleteLPActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
    },
  },
  options,
);

export const submitAnswerActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
      nodeId: { type: String, required: true },
      exerciseType: {
        type: String,
        required: true,
        enum: Object.values(Types.ExerciseType),
      },
      answer: { type: String, required: true },
      result: { type: String, required: true }, //da rendere boolean
    },
  },
  options,
);

export const gradeActionSchema = new Schema(
  {
    ...baseActionSchema.obj,
    action: {
      flowId: { type: String, required: true },
      grade: { type: Number, required: true },
    }
  }
)

// MODELLO BASE
export const BaseActionModel = model<BaseActionDocument>(
  "BaseAction",
  baseActionSchema,
);

// MODELLI SPECIFICI CON DISCRIMINATORE
export const RegistrationToWorkAdventureActionModel =
  BaseActionModel.discriminator<RegistrationToWorkAdventureActionDocument>(
    "RegistrationToWorkAdventureAction",
    registrationToWorkAdventureActionSchema,
  );

export const LogInToWorkAdventureActionModel =
  BaseActionModel.discriminator<LogInToWorkAdventureActionDocument>(
    "LogInToWorkAdventureAction",
    logInToWorkAdventureActionSchema,
  );

export const LogOutToWorkAdventureActionModel =
  BaseActionModel.discriminator<LogOutToWorkAdventureActionDocument>(
    "LogOutToWorkAdventureAction",
    logOutToWorkAdventureActionSchema,
  );

export const LogInToPolyGloTActionModel =
  BaseActionModel.discriminator<LogInToPolyGloTActionDocument>(
    "LogInToPolyGloTAction",
    logInToPolyGloTActionSchema,
  );

export const LogOutToPolyGloTActionModel =
  BaseActionModel.discriminator<LogOutToPolyGloTActionDocument>(
    "LogOutToPolyGloTAction",
    logOutToPolyGloTActionSchema,
  );

export const OpenToolActionModel =
  BaseActionModel.discriminator<OpenToolActionDocument>(
    "OpenToolAction",
    openToolActionSchema,
  );

export const CloseToolActionModel =
  BaseActionModel.discriminator<CloseToolActionDocument>(
    "CloseToolAction",
    closeToolActionSchema,
  );

export const OpenNodeActionModel =
  BaseActionModel.discriminator<OpenNodeActionDocument>(
    "OpenNodeAction",
    openNodeActionSchema,
  );

export const CloseNodeActionModel =
  BaseActionModel.discriminator<CloseNodeActionDocument>(
    "CloseNodeAction",
    closeNodeActionSchema,
  );

export const ChangeNodeActionModel =
  BaseActionModel.discriminator<ChangeNodeActionDocument>(
    "ChangeNodeAction",
    changeNodeActionSchema,
  );

export const OpenLPInfoActionModel =
  BaseActionModel.discriminator<OpenLPInfoActionDocument>(
    "OpenLPInfoAction",
    openLPInfoActionSchema,
  );

export const CloseLPInfoActionModel =
  BaseActionModel.discriminator<CloseLPInfoActionDocument>(
    "CloseLPInfoAction",
    closeLPInfoActionSchema,
  );

export const SearchForLPActionModel =
  BaseActionModel.discriminator<SearchForLPActionDocument>(
    "SearchForLPAction",
    searchForLPActionSchema,
  );

export const ShowLPActionModel =
  BaseActionModel.discriminator<ShowLPActionDocument>(
    "ShowLPAction",
    showLPActionSchema,
  );

export const SelectLPActionModel =
  BaseActionModel.discriminator<SelectLPActionDocument>(
    "SelectLPAction",
    selectLPActionSchema,
  );

export const RemoveLPSelectionActionModel =
  BaseActionModel.discriminator<RemoveLPSelectionActionDocument>(
    "RemoveLPSelectionAction",
    removeLPSelectionActionSchema,
  );

export const CreateLPActionModel =
  BaseActionModel.discriminator<CreateLPActionDocument>(
    "CreateLPAction",
    createLPActionSchema,
  );

export const ModifyLPActionModel =
  BaseActionModel.discriminator<ModifyLPActionDocument>(
    "ModifyLPAction",
    modifyLPActionSchema,
  );

export const DeleteLPActionModel =
  BaseActionModel.discriminator<DeleteLPActionDocument>(
    "DeleteLPAction",
    deleteLPActionSchema,
  );

export const SubmitAnswerActionModel =
  BaseActionModel.discriminator<SubmitAnswerActionDocument>(
    "SubmitAnswerAction",
    submitAnswerActionSchema,
  );

export const GradeActionModel =
  BaseActionModel.discriminator<GradeActionDocument>(
    "GradeAction",
    gradeActionSchema,
  );
