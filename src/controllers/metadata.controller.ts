import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import { ClassElement } from "typescript";
import { customValidationEdgeSchema, edgeSchema, PolyglotEdgeModel } from "../models/edge.models";
import { flowSchema } from "../models/flow.model";
import { multipleChoiceQuestionNodeSchema, nodeSchema, PolyglotNodeModel } from "../models/node.model";

// {
//   backend_1  |   _id: {
//   backend_1  |     type: [Function: String],
//   backend_1  |     required: true,
//   backend_1  |     default: [Function: default],
//   backend_1  |     validate: { validator: [Function: validator], message: 'Invalid UUID-v4' }    
//   backend_1  |   },
//   backend_1  |   title: { type: [Function: String], required: true },
//   backend_1  |   description: { type: [Function: String], required: true },
//   backend_1  |   nodes: [
//   backend_1  |     {
//   backend_1  |       type: [Object],
//   backend_1  |       title: [Object],
//   backend_1  |       description: [Object],
//   backend_1  |       difficulty: [Object],
//   backend_1  |       data: [Object],
//   backend_1  |       reactFlow: [Object]
//   backend_1  |     }
//   backend_1  |   ],
//   backend_1  |   edges: [
//   backend_1  |     {
//   backend_1  |       type: [Object],
//   backend_1  |       title: [Object],
//   backend_1  |       code: [Object],
//   backend_1  |       data: [Object],
//   backend_1  |       reactFlow: [Object]
//   backend_1  |     }
//   backend_1  |   ]
//   backend_1  | }

type Metadata = MetadataField[];

type MetadataField = {
  type: string;
  sub?: string;
  name: string;
  ref?: string;
  fields?: Metadata;
  options?: string[];
  constraints: {};
  onChange?: () => void;
};

function pushField(f: any, key: string, output: Metadata, isArray?: boolean) {
  let field: MetadataField = {type: "", name: key, constraints: {}};
  let tmp = typeof f === "object" ? f : { type: f};
  const type = tmp.type?.toString() || tmp?.toString();
  
  if (type.includes("String")) {
    field.type = "string";
  }
  if (type.includes("Number")) {
    field.type = "number"
  }
  if (type.includes("Object")) {
    field.type = "any";
    if (!(f.type instanceof Object)) field.fields = getMetadata(f)
  }
  if (type.includes("Boolean")) {
    field.type = "boolean"
  }
  if (isArray) {
    field.sub = field?.type;
    field.type = "array";
  }
  if (f.enum) {
    field.sub = field?.type;
    field.type = "enum";
    field.options = f.enum;
  }

  if (key === "file") field.type = "file";
  if (key === "description") field.type = "textarea";
  if (key === "codeTemplate" || key === "code") field.type = "code";

  output.push(field);
}

function getMetadata(obj: any) {
  let output: Metadata = [];
  let field: MetadataField = {type: "", name: "", constraints: {}}
  Object.keys(obj).forEach((key) => {
    if(key?.[0] === '_') return; // skip hidden fields
    if (Array.isArray(obj[key])) {
      field = obj[key][0];
      if (field.ref) {
        // Caso in cui andiamo a creare una array di ref
        // eventualmente aggiungere una deserializzazione anche del campo esterno (Node)
        output.push({type: field.ref, name: key, constraints: {}})
      } else {
        // Caso in cui andiamo a definire un tipo array oggetto
        //const sub = getMetadata({type: "array"});
        pushField(field, key, output, true)
      }
    } else{
      // Caso base in cui andiamo ad analizzare un field semplice
      pushField(obj[key], key, output);
    }
  })
  
  return output;
}

export async function flowMetadata(req: Request, res: Response) {
  const mongooseDef = flowSchema.obj as any;

  try {
    return res.status(200).send(getMetadata(mongooseDef));
  } catch (e) {
    return res.status(400).send(e);
  }
}

export const edgeMetadata = (req: Request, res: Response) => {
  const discriminators = PolyglotEdgeModel.discriminators;

  let output: any = {};
  if (discriminators){
    Object.keys(discriminators).forEach((index,_,array) => {
      const schema = discriminators[index].schema.obj;
      let meta = getMetadata(schema);
      meta.push({type: "enum", sub: "string", name: "type", options: array, constraints: {}})
      output[index] = meta;
    })
  } else{
    output = getMetadata(PolyglotEdgeModel.schema.obj);
  }

  return res.status(200).send(output);
}

export const nodeMetadata = (req: Request, res: Response) => {
  const discriminators = PolyglotNodeModel.discriminators;

  let output: any = {};
  if (discriminators){
    Object.keys(discriminators).forEach((index,_,array) => {
      const schema = discriminators[index].schema.obj;
      let meta = getMetadata(schema);
      meta.push({type: "enum", sub: "string", name: "type", options: array, constraints: {}})
      output[index] = meta;
    })
  } else{
    output = getMetadata(PolyglotNodeModel.schema.obj);
  }

  return res.status(200).send(output);
}

export const generalMetadata = (model: Model<any>) => async (req: Request, res: Response) => {
  const type = req.params?.type
  const discriminators = model.discriminators;
  let schema;
  if (type && discriminators && discriminators?.[type]) {
    schema = discriminators[type].schema.obj;
  } else {
    schema = model.schema.obj;
  }
  let metadata = getMetadata(schema);
  if (discriminators) metadata.push({type: "enum", sub: "string", name: "type", options: Object.keys(discriminators), constraints: {}})
  return res.status(200).send(metadata);
}