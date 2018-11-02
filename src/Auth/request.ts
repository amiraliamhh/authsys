import {
  Request,
  Response,
  NextFunction
} from 'express';
import { sendErr } from '../RoutesFunctions';

interface IAuthReqArgs {
  json?: boolean|string;
  UID?: boolean|string;
  token?: boolean|string;
  [key: string]: any;
}

export function authReq(args: IAuthReqArgs): (req: Request, res: Response, next: NextFunction) => void {
  return function (req: Request, res: Response, next: NextFunction) {

    const checks: IAuthReqArgs = {
      json: req.is('application/json'),
      UID: req.get('X-UID'),
      token: req.get('X-TOKEN')
    };

    for (let c in checks) {
      if (args[c] && !checks[c]) {
        sendErr('wrong format | uid/token is missing', res, 400);
        return;
      }
    }

    next();
  }
}