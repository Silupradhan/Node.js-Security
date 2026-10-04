import jwt from "jsonwebtoken";
import crypto from "node:crypto";

export function createAcceassToken(userid : string, role : string)  {
   return jwt.sign({
        userid,
        role,
        type : "access"
    }, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "15m"
    })
}

export function createRefreshToken(userid : string, role : string)  {
   return jwt.sign({
        userid,
        role,
        type : "refresh"
    }, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: "7d"
    })
}

export function createCsrfToken() {
    return crypto.randomBytes(32).toString("hex")
}