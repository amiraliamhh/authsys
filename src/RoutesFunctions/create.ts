import {
  Request,
  Response,
  NextFunction
} from 'express';

import { codeJwt, IJWTObj } from '../Auth/index';
import UserModel, { IUser } from '../Model/index';
import { IRes } from '../utils/responses';
import { sendErr } from './index';

export function signUp(req: Request, res: Response, next: NextFunction) {
  const user: IUser = {
    email: <string>req.body.email,
    password: <string>req.body.password,
    uids: [req.get('X-UID') as string]
  }

  UserModel.create(user)
  .then((userObj: any) => {
    const newUser: IJWTObj = {
      email: <string>userObj.email,
      password: <string>userObj.password,
      uid: req.get('X-UID') as string
    };

    codeJwt(newUser)
    .then((token: string) => {
      const response: IRes = {
        success: true,
        token
      };

      res.json(response);
    })
    .catch(err => sendErr(err, res))
  })
  .catch(err => sendErr(err, res));
};