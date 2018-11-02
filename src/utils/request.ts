import { Request } from 'express';

export interface mergedReq extends Request {
  jwt?: string;
}