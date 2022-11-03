import { Request, Response } from "express";

// FIX: implementare deserializzatore per limitare l'output
export const getUserInfo = async (req: Request, res: Response) => {
  res.json(req.user);
}