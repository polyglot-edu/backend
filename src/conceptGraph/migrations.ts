import { Database } from "sqlite";
import { initDb } from "./db";

export const createConceptLexiconTable = async (db: Database) => {
  await db.run(`CREATE TABLE IF NOT EXISTS concepts_lexicon (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  )`)
}

export const createEncoreOersTable = async (db: Database) => {
  await db.run(`CREATE TABLE IF NOT EXISTS encore_oers (
    id INTEGER PRIMARY KEY,
    title TEXT,
    description TEXT
  )`)
}

export const createOerConceptTable = async (db: Database) => {
  await db.run(`CREATE TABLE IF NOT EXISTS oers_concept (
    id INTEGER PRIMARY KEY,
    extracted_concepts TEXT
  )`)
}

export const createOerWikiTable = async (db: Database) => {
  await db.run(`CREATE TABLE IF NOT EXISTS oers_wiki (
    id INTEGER,
    concept1 TEXT,
    concept2 TEXT,
    edge INTEGER(1)
  )`)
}

export const initTables = async (db: Database) => {
  await createConceptLexiconTable(db);
  await createEncoreOersTable(db);
  await createOerConceptTable(db);
  await createOerWikiTable(db);
}

(async () => {
    const db = await initDb();
    await initTables(db);
})()
