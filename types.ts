import OpineSession from "./src/frameworks/OpineSession.ts";

import type {NextFunction, Request, Response, Opine, ParamsDictionary} from "https://deno.land/x/opine@1.6.0/mod.ts";
interface OpineRequest extends Request<ParamsDictionary, any, any> {
    session:OpineSession
}
export type {OpineRequest,NextFunction, Request, Response, Opine, ParamsDictionary}