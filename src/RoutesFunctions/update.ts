import {
  Request,
  Response,
  NextFunction
} from 'express';

import UserModel, { IUserSchema } from '../Model/index';
import { getUserByToken } from '../Auth';
import { sendErr } from '.';
import { IRes } from '../utils/responses';

export function updateUser(req: Request, res: Response, next: NextFunction) {
  getUserByToken(
    req.get('X-TOKEN') as string,
    req.get('X-UID') as string,
    false
  )
  .then((user: IUserSchema) => {
    
    const updatingProps = req.body;
    delete updatingProps.email;

    UserModel.findOneAndUpdate({email: user.email}, {
      $set: updatingProps
    })
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