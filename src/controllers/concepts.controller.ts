import { NextFunction, Request, Response } from "express";
import { getGraph, getSubConceptMap } from "../conceptGraph/helper";
import { escapeRegExp } from "../utils/general";
import { conn } from "../conceptGraph/db";
import { queryAllConcepts, queryFilterWikiConcept, queryOerSkill, queryOers } from "../conceptGraph/query";

type GenGraphExtBody = {
  extracted_concepts: string[]
}

type GenGraphSkillBody = {
  skill: string;
}

type GenGraphOersBody = {
  oers_ids: number[];
}

type ExtractConceptsBody = {
  text: string;
}

type EncoreNode = {
  name: string;
  node_id: number;
}

export async function genGraphExt(req: Request<{}, any, GenGraphExtBody>, res: Response, next: NextFunction) {
  const { extracted_concepts } = req.body;

  if (!extracted_concepts || extracted_concepts.length === 0) {
    return res.status(400).json({error: "extracted_concepts non provided!"});
  }
  
  // extract concepts and remove duplicates
  const concepts = [...new Set(extracted_concepts)]

  const subMap = await getSubConceptMap(concepts);

  const graph = getGraph(subMap, concepts);

  return res.status(200).json(graph)
}

export async function genGraphSkill(req: Request<{}, any, GenGraphSkillBody>, res: Response) {
  const { skill } = req.body;

  if (!skill) {
    return res.status(400).json({error: "skill not provided!"});
  }

  const { db } = conn;

  if (!db) {
    return res.status(500).json({error: "sqlite database not started"})
  }

  const oer_data_sample = await queryOerSkill(db,skill);
  const wiki_concepts_sample_clean = await queryFilterWikiConcept(db,oer_data_sample.map((v) => v.id));
  let nodeIds: {[x: string]: number}  = {}
  let nodes: EncoreNode[] = [];
  let edges: any = []
  let nodes_count = 1
  wiki_concepts_sample_clean.forEach((row) => {
    if (!nodeIds[row.concept1]) {
      nodeIds[row.concept1] = nodes_count;
      const node: EncoreNode = {name: row.concept1,node_id: nodes_count++};
      nodes.push(node);
    }
    if (!nodeIds[row.concept2]) {
      nodeIds[row.concept2] = nodes_count;
      const node: EncoreNode = {name: row.concept2,node_id: nodes_count++};
      nodes.push(node);
    }
  })
  wiki_concepts_sample_clean.forEach((row) => {
    edges.push({from: nodeIds[row.concept1], to: nodeIds[row.concept2]})
  })
  const graph = {nodes: nodes, edges: edges};  

  return res.status(200).json(graph);
}

export async function extractConcepts(req: Request<{},any, ExtractConceptsBody>, res: Response) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({error: "text not provided!"})
  }

  const { db } = conn;

  if (!db) {
    return res.status(500).json({error: "sqlite not started!"})
  }

  const concepts = await queryAllConcepts(db);

  // TODO: create a unified regex to improve performance
  // let regex = ""
  // concepts.forEach((concept) => regex += `(?=.*${escapeRegExp(concept.name)})|`);
  // regex = regex.slice(0,-1);

  // const extracted_concepts = [...text.matchAll(RegExp(regex, "g"))];

  const extracted_concepts = concepts.filter(c => text.match(RegExp(`\\b${escapeRegExp(c.name)}\\b`, "ims")));

  return res.status(200).json({extracted_concepts: [...new Set(extracted_concepts.map(c => c.name))]});
}

export async function genGraphOers(req: Request<{}, any, GenGraphOersBody>, res: Response) {
  const { oers_ids } = req.body;

  if (!oers_ids || oers_ids.length === 0) {
    return res.status(400).json({error: "oers_ids not provided!"});
  }

  const { db } = conn;

  if (!db) {
    return res.status(500).json({error: "sqlite database not started"})
  }

  const oer_data_sample = await queryOers(db,oers_ids);
  const wiki_concepts_sample_clean = await queryFilterWikiConcept(db,oer_data_sample.map((v) => v.id));
  let nodeIds: {[x: string]: number}  = {}
  let nodes: EncoreNode[] = [];
  let edges: any = []
  let nodes_count = 1
  wiki_concepts_sample_clean.forEach((row) => {
    if (!nodeIds[row.concept1]) {
      nodeIds[row.concept1] = nodes_count;
      const node: EncoreNode = {name: row.concept1,node_id: nodes_count++};
      nodes.push(node);
    }
    if (!nodeIds[row.concept2]) {
      nodeIds[row.concept2] = nodes_count;
      const node: EncoreNode = {name: row.concept2,node_id: nodes_count++};
      nodes.push(node);
    }
  })
  wiki_concepts_sample_clean.forEach((row) => {
    edges.push({from: nodeIds[row.concept1], to: nodeIds[row.concept2]})
  })
  const graph = {nodes: nodes, edges: edges};  

  return res.status(200).json(graph);
}