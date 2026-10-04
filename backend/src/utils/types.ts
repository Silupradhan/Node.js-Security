import { type Request} from "express"

export type AuthTokenPayload = {
    userid: string;
    role: string;
    type: "access" | "refresh";
}

export type AuthenticatedRequest = Request & {
    authUser?: {
        userid: string;
        role: string;
    };
};