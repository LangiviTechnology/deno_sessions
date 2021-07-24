import {Store} from "./Store.ts";
import {
    ensureDir, tempDir, exists
} from "../../deps.ts";

export default class FileStore implements Store {

    #path: string;
    constructor(options: { path?: string }) {
        this.#path = options.path || tempDir
        this.init();
    }

    async init() {
        await ensureDir(this.#path);
    }

    async sessionExists(sessionId: string) {
        return await exists(this.#path + '/' + sessionId)

    }

    async getSessionById(sessionId: string) {
        const sessionPath = this.#path + '/' + sessionId;
        if (await exists(sessionPath)) {
            const sessionText = await Deno.readTextFile(sessionPath);
            return JSON.parse(sessionText);
        }

        throw new ReferenceError('Session' + sessionId + ' not found');
    }

    async createSession(sessionId: string) {
        const sessionPath = this.#path + '/' + sessionId;
        if (!await exists(sessionPath)) {
            await Deno.writeTextFile(sessionPath, JSON.stringify({
                '_flash': {}
            }));
        }
    }

    async persistSessionData(sessionId: string, sessionData: unknown) {
        const sessionPath = this.#path + '/' + sessionId;
        if (await exists(sessionPath)) {
            await Deno.writeTextFile(sessionPath, JSON.stringify(sessionData));
        }
    }

    async deleteSession(sessionId: string) {
        const sessionPath = this.#path + '/' + sessionId;
        if (await exists(sessionPath)) {
            await Deno.remove(sessionPath);
            return true
        }
        return false;
    }
}