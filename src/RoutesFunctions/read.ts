import {
  Request,
  Response,
  NextFunction
} from 'express';
import bcrypt from 'bcryptjs';

import UserModel from '../Model/index';
import { codeJwt, IJWTObj } from '../Auth/index';
import { sendErr } from './index';
import { IRes } from '../utils/responses';

export function signIn(req: Request, res: Response, next: NextFunction) {
    UserModel.findOne({email: req.body.email})
    .then((userObj: any) => {

      bcrypt.compare(req.body.password, userObj.password)
      .then((result: boolean) => {
        if (result) {
          const payload: IJWTObj = {
            email: userObj.email,
            password: userObj.password,
            uid: req.body.uid
          };

          codeJwt(payload)
          .then((token: string) => {
            const response: IRes = {
              success: true,
              token
            };

            res.json(response);
          })
          .catch(err => sendErr(err, res))

        } else {
          res.status(400).json({success: false, err: 'wrong password'});
        }
      })
      .catch(err => sendErr(err, res));
    })
    .catch(err => sendErr(err, res));
}