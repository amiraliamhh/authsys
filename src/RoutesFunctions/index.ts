import { Response } from 'express';

export function sendErr(err: any, res: Response) {
  const response: IRes = {
    success: false,
    err
  };

  res.status(500).json(response);
  throw err;
}