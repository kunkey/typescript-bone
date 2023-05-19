import { Response } from "express";

export const sendSuccess = (res: Response, data: { [key: string]: any }, message: string = "") => {
  res.status(200).json({ message, data });
};

export const sendError = (res: Response, code: number, error: string | string[], errorSubject: Error = undefined) => {
  if (errorSubject) console.log(errorSubject);
  res.status(code).json({ error });
};

