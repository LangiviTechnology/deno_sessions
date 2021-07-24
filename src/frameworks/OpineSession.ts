import Session from '../Session.ts'
import {getCookies} from "https://deno.land/std@0.93.0/http/cookie.ts";
import {Store} from "../stores/Store.ts";
import {NextFunction, Request, Response, Opine, OpineRequest} from "../../types.ts";

export default class OpineSession extends Session {
    constructor(opineApp: Opine, options: { secure?: boolean, path?: string } = {}, store: Store) {
        super(store || null)

        opineApp.use(async (req: Request | OpineRequest, res: Response, next: NextFunction) => {
            const {sid} = getCookies(req as Request);

            // if (req.url == '/favicon.ico') {
            //   await next()
            // }

            if (!options.secure) {
                options.secure = req.protocol === "https" ? true : false;
            }
            if (!options.path) {
                options.path = "/";
            }

            if (sid && await this.sessionExists(sid)) {
                (req as OpineRequest).session = this.getSession(sid)
            } else {
                (req as OpineRequest).session = await this.createSession()
                res.cookie('sid', (req as OpineRequest).session.id)
            }

            await next()
        })
    }
}