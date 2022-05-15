import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";

export async function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
    logger.info(`${req.method} ${req.url}`);
    next();
};