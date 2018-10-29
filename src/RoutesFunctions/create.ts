import {
  Request,
  Response,
  NextFunction
} from 'express';

import { codeJwt, IJWTObj } from '../Auth/index';
import UserModel, { IUserSchema } from '../Model/index';
import { IRes } from '../utils/responses';
import { sendErr } from './index';

export function signUp(req: Request, res: Response, next: NextFunction) {
  const user: IUserSchema = {
    email: <string>req.body.email,
    password: <string>req.body.password,
    uids: [<string>req.body.uid]
  }

  UserModel.create(user)
  .then((userObj: any) => {
    const newUser: IJWTObj = {
      email: <string>userObj.email,
      password: <string>userObj.password,
      uid: <string>req.body.uid
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