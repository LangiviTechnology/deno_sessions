import { DB } from "https://deno.land/x/sqlite@v2.4.0/mod.ts";
import {Store} from "./Store.ts";

export default class SqliteStore implements Store{
  #db:DB;
  #path:string;
  #tableName:string;
  constructor(options:{path:string, tableName?:string}) {
    this.#db = new DB(options.path)
    this.#path = options.path
    this.#tableName = options.tableName || 'sessions'
    this.#db.query(`CREATE TABLE IF NOT EXISTS ${this.#tableName} (id TEXT, data TEXT)`)
  }

  sessionExists(sessionId:string) {
    let session = ''
    
    for (const [sess] of this.#db.query(`SELECT data FROM ${this.#tableName} WHERE id = ?`, [sessionId])) {
      session = sess
    }

    return session ? true : false;
  }

  getSessionById(sessionId:string) {
    let session = ''
    
    for (const [sess] of this.#db.query(`SELECT data FROM ${this.#tableName} WHERE id = ?`, [sessionId])) {
      session = sess
    }

    return JSON.parse(session);
  }

  createSession(sessionId:string) {
    this.#db.query(`INSERT INTO ${this.#tableName} (id, data) VALUES (?, ?)`, [sessionId, JSON.stringify({
      '_flash': {}
    })]);
  }

  persistSessionData(sessionId:string, sessionData:unknown) {
    this.#db.query(`UPDATE ${this.#tableName} SET data = ? WHERE id = ?`, [
      JSON.stringify(sessionData), sessionId
    ]);
  }

  deleteSession(sessionId: string): Promise<boolean> | boolean {
    this.#db.query(`DELETE FROM ${this.#tableName} WHERE id = ?`, [sessionId]);
    return !!this.#db.changes;
  }
}