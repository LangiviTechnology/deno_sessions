import OpineSession from "./src/frameworks/OpineSession.ts";

import type {Request, ParamsDictionary} from "./deps.ts"
interface OpineRequest extends Request<ParamsDictionary, any, any> {
    session:OpineSession
}
export type {OpineRequest}