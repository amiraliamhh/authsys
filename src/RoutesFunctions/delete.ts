import {
  Request,
  Response,
  NextFunction
} from 'express';

import { getUserByToken } from '../Auth';
import { sendErr } from '.';
import UserModel, { IUserSchema } from '../Model';
import { IRes } from '../utils/responses';

export function deleteUser(req: Request, res: Response, next: NextFunction) {
  getUserByToken(
    req.get('X-TOKEN') as string,
    req.get('X-UID') as string,
    false
  )
  .then((user) => {
    const iUser = <IUserSchema>user;

    UserModel.findOneAndDelete({email: iUser.email})
    .then(() => {
      const response: IRes = {
        success: true
      };

      res.json(response);
    })
    .catch(err => sendErr(err, res));    
  })
  .catch(err => sendErr(err, res, 400));
}