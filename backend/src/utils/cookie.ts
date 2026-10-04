import { createAcceassToken, createCsrfToken, createRefreshToken } from "./jwt"
import type { Response, Request, NextFunction } from "express"

const ACCESS_COOKIE = "access_token"
const REFRESH_COOKIE = "refresh_token"
const CSRF_COOKIE = "csrf_token"

const COOKIE_SECURE = process.env.COOKIE_SECURE
const COOKIE_SAMESITE = process.env.COOKIE_SAMESITE

function createCookieOptions(maxAge: number) {
  return{
    httpOnly: true,
    secure: COOKIE_SECURE === "false",
    sameSite: COOKIE_SAMESITE as "strict" | "lax" | "none",
    maxAge: maxAge,
    path: "/",
  }
}

function createCsrfCookieOptions(maxAge: number) {
    return {
    httpOnly: true,
    secure: COOKIE_SECURE === "false",
    sameSite: COOKIE_SAMESITE as "strict" | "lax" | "none",
    maxAge: maxAge,
    path: "/",
    }
}

export function setAuthCookies(res : Response , userId : string, role : string) {
    const accessToken  = createAcceassToken(userId, role)                                                           
    const refreshToken = createRefreshToken(userId, role)
    const csrfToken = createCsrfToken()

    const accessMaxAge = 15 * 60 * 1000 // 15 minutes
    const refreshMaxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
    const csrfMaxAge = 15 * 60 * 1000 // 15 minutes

    res.cookie(ACCESS_COOKIE, accessToken, createCookieOptions(accessMaxAge))
    res.cookie(REFRESH_COOKIE, refreshToken, createCookieOptions(refreshMaxAge))
    res.cookie(CSRF_COOKIE, csrfToken, createCsrfCookieOptions(csrfMaxAge))
}

export function clearAuthCookies(res : Response) {
    res.clearCookie(ACCESS_COOKIE, createCookieOptions(0))
    res.clearCookie(REFRESH_COOKIE, createCookieOptions(0))
    res.clearCookie(CSRF_COOKIE, createCsrfCookieOptions(0))

}

export function verifyCsrfToken(req : Request, res : Response, next : NextFunction) {
    const csrfTokenFromCookie = req.cookies[CSRF_COOKIE]
    const csrfTokenFromHeader = req.headers["x-csrf-token"]

    if(!csrfTokenFromCookie || !csrfTokenFromHeader || csrfTokenFromCookie !== csrfTokenFromHeader) {
        return res.status(403).json({ message: "Invalid CSRF token" })
    }

    next()
}