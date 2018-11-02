import { Response } from 'express';
import { IRes } from '../utils/responses';

export function sendErr(err: any, res: Response, errCode?: number) {
  const response: IRes = {
    success: false,
    err
  };

  if (errCode) {
    res.status(errCode).json(response);
  } else {
    res.status(500).json(response);
  }
  
  throw err;
}

export { signUp } from './create';
export {
  readUser,
  signIn,
} from './read';
export {
  updateUser
} from './update';
export {
  deleteUser
} from './delete';