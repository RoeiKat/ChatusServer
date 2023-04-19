import { Request, Response, NextFunction } from "express";

export class HTMLError extends Error {
  message: string;
  statusCode?: number;
  constructor(message: string, statusCode: number) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

type ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => any;

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`${error} + ${new Date()}`);
  const status = error.statusCode || 500;
  const message = error.message;
  console.log(error);
  res.status(status).json({ message: message, status: status });
};
