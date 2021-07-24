import Session from '../Session.ts'
import { getCookies } from "https://deno.land/std@0.93.0/http/cookie.ts";
import type {NextFunction, Request, Response, Opine} from "https://deno.land/x/opine@1.6.0/mod.ts";
import {Store} from "../stores/Store.ts";
export interface OpineRequest extends Request {
  session:OpineSession
}
export default class OpineSession extends Session {
  constructor(opineApp:Opine, options:{secure?:boolean, path?:string} = {}, store:Store) {
    super(store || null)

    opineApp.use(async (req:OpineRequest, res:Response, next:NextFunction) => {
      const { sid } = getCookies(req as Request);

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
        req.session = this.getSession(sid)
      } else {
        req.session = await this.createSession()
        res.cookie('sid', req.session.id)
      }

      await next()
    })
  }
}