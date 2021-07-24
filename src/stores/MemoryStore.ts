import {Store} from "./Store.ts";

export default class MemoryStore implements Store{
  #data:Map<string, unknown> = new Map();
  constructor() {

  }
  sessionExists(sessionId:string) {
    return this.#data.has(sessionId)
  }

  getSessionById(sessionId:string) {
    return this.#data.get(sessionId)
  }

  createSession(sessionId:string) {
    this.#data.set(sessionId, {
      '_flash': {}
    })
  }

  persistSessionData(sessionId:string, sessionData:unknown) {
    this.#data.set(sessionId, sessionData)
  }

  deleteSession(sessionId: string) {
      return this.#data.delete(sessionId);
  }
}