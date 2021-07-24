export interface Store {
    sessionExists(sessionId: string) : Promise<boolean> | boolean;
    getSessionById(sessionId: string) : Promise<any>|any;
    createSession(sessionId: string) : Promise<void>|void;
    persistSessionData(sessionId:string, sessionData:unknown):Promise<void>|void;
    deleteSession(sessionId: string) : Promise<boolean>|boolean;
}