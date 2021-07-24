import {connect, Redis}  from "../../deps.ts";
import {Store} from "./Store.ts";

export default class RedisStore implements Store {

    #host: string;
    #port: number;
    // @ts-ignore Unexpected behaviour
    #db: Redis;
    private keyPrefix: string;

    constructor(options: { host: string, port: number }) {
        this.#host = options.host
        this.#port = options.port
        this.keyPrefix = 'session_';
        connect({
            hostname: this.#host,
            port: this.#port
        }).then(db => this.#db = db);
    }

    async sessionExists(sessionId: string) {
        const session = await this.#db.get(this.keyPrefix + sessionId)
        return session ? true : false
    }

    async getSessionById(sessionId: string) {
        const value = JSON.parse(await this.#db.get(this.keyPrefix + sessionId) as string)
        return value
    }

    async createSession(sessionId: string) {
        await this.#db.set(this.keyPrefix + sessionId, JSON.stringify({
            '_flash': {}
        }))
    }

    async persistSessionData(sessionId: string, sessionData: unknown) {
        await this.#db.set(this.keyPrefix + sessionId, JSON.stringify(sessionData))
    }

    async deleteSession(sessionId: string): Promise<boolean>{
        await this.#db.set(this.keyPrefix + sessionId, '');
        return true
    }
}