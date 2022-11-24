import { NextFunction, Request, Response } from "express";

export async function checkAuth(req: Request, res: Response, next: NextFunction) {
    if (req.user) return next();
    res.status(401).send();
};