import { Database } from "sqlite";

export type EncoreOer = {
  id: number;
  title: string;
  description: string;
  skills: string;
}

export type OerConcept = {
  id: number;
  extracted_concepts: string;
}

export type OerWiki = {
  id: number;
  concept1: string;
  concept2: string;
  edge: boolean
}

export type EncoreConcept = {
  id: number;
  name: string;
}

export const queryAllConcepts = async (db: Database) => {
  const resp = await db.all<EncoreConcept[]>('SELECT name FROM concepts_lexicon');
  return resp
}

export const queryOerSkill = async (db: Database, skill: string) => {
  const resp = await db.all<EncoreOer[]>(`
    SELECT * FROM encore_oers
    WHERE (description NOT NULL AND description regexp '(?i)\\b${skill}\\b')
      or (title NOT NULL AND title regexp '(?i)\\b${skill}\\b')`);
  return resp;
}

export const queryOers = async (db: Database, oers_ids: number[]) => {
  const resp = await db.all<EncoreOer[]>(`
    SELECT * FROM encore_oers
    WHERE id in (${oers_ids.join(",")})`);
  return resp;
}

// TODO: remove adjectives and countries concepts
export const queryFilterWikiConcept = async (db: Database, oersIds: number[]) => {
  const resp = await db.all<OerWiki[]>(`
    SELECT DISTINCT concept1, concept2 
    FROM oers_wiki 
    WHERE id IN (${oersIds.join(",")}) 
      and edge=1`); // and concept1 NOT IN (SELECT adjectives FROM words_speech)
                    // and concept2 NOT IN (SELECT adjectives FROM words_speech)
  return resp;
}

export const queryConcepts = async (db: Database, oersIds: number[]) => {
  const resp = await db.all<OerConcept[]>(`
    SELECT * 
    FROM oers_concept 
    WHERE id IN (${oersIds.join(",")})`);
  const output: string[] = [];
  resp.forEach(ec => output.push(...ec.extracted_concepts.split(",")));
  return output;
}