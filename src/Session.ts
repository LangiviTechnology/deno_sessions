import { v4 } from "https://deno.land/std@0.93.0/uuid/mod.ts"
import MemoryStore from './stores/MemoryStore.ts'
import {Store} from "./stores/Store.ts";

export default class Session {
   private store:Store;
   public id:string = '';
  constructor (store:Store|null = null) {
    this.store = store || new MemoryStore
  }

  async sessionExists(id:string) {
    return await this.store.sessionExists(id)
  }

  async createSession() {
    this.id = v4.generate()
    await this.store.createSession(this.id)
    return this
  }

  getSession(id:string) {
    this.id = id
    return this
  }

  async get(key:string) {
    const session = await this.store.getSessionById(this.id)

    if (session.hasOwnProperty(key)) {
      return session[key]
    } else {
      return session['_flash'][key]
    }
  }

  async set(key:string, value:unknown) {
    const session = await this.store.getSessionById(this.id)
    session[key] = value
    await this.store.persistSessionData(this.id, session)
  }

  async flash(key:string, value:unknown) {
    const session = await this.store.getSessionById(this.id)
    session['_flash'][key] = value
    await this.store.persistSessionData(this.id, session)
  }

  async has(key:string) {
    const session = await this.store.getSessionById(this.id)

    if (session.hasOwnProperty(key)) {
      return true
    } else {
      if (session['_flash'].hasOwnProperty(key)) {
        return true
      } else {
        return false
      }
    }
  }

  async delete(key:string){
    return await this.store.deleteSession(key);
  }
}