import {UserDBType} from "./user-type";

declare global {
    declare namespace Express {
        export interface  Request {
            user: UserDBType | null
        }
    }
} // расширение типов