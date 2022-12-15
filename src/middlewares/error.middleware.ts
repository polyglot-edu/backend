import { NextFunction, Request, Response } from "express";

// FIX: Migliora l'output
export async function errorMiddleware(err : Error, req: Request, res: Response, next: NextFunction) {
    switch (err.name) {
    case "MongoError":
        return res.status(400).send(err);
    case "MongoServerError":
        return res.status(400).send(err);
    default:
        return res.status(500).send(err);
    }
};