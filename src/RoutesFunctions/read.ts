import {
  Request,
  Response,
  NextFunction
} from 'express';
import bcrypt from 'bcryptjs';

import UserModel, { IUserSchema } from '../Model/index';
import { codeJwt, IJWTObj, decodeJwt } from '../Auth/index';
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
            uid: req.get('X-UID') as string
          };

          UserModel.findOneAndUpdate({email: userObj.email}, {
            $set: {
              uids: userObj.uids.concat(req.get('X-UID'))
            }
          })
          .then(() => {
            codeJwt(payload)
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

        } else {
          res.status(400).json({success: false, err: 'wrong password'});
        }
      })
      .catch(err => sendErr(err, res));
    })
    .catch(err => sendErr(err, res));
}

export function readUser(req: Request, res: Response, next: NextFunction) {
  decodeJwt(req.get('X-TOKEN') as string)
  .then((payload: IJWTObj) => {
    UserModel.findOne({email: payload.email})
    .select('-password')
    .then((user) => {
      const iUser = <IUserSchema>user;
      if (iUser.uids.includes(req.get('X-UID') as string)) {
        const response: IRes = {
          success: true,
          data: user
        };

        res.json(response);

      } else {
        sendErr('uid not found', res);
      }

    })
    .catch(err => sendErr(err, res))
  })
  .catch(err => sendErr(err, res))
}