import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";


export const initDb = async () => {
  const db = await open({
      filename: 'encoreDB',
      driver: sqlite3.Database
  })

  await db.loadExtension("./regex0")

  // TODO: test speed
  // await db.exec("pragma journal_mode = WAL;")
  await db.exec("pragma synchronous = NORMAL;")
  await db.exec("pragma mmap_size = 30000000000;")

  return db;
}

export const conn:{db: Database | null} = {
  db: null
}
