import {
  Router
} from 'express';

import { 
  deleteUser,
  readUser,
  signIn,
  signUp,
  updateUser,
} from '../RoutesFunctions/index';
import { authReq } from '../Auth';

export const userRouter = Router();

userRouter.post('/read', authReq({json: true, UID: true, token: true}), readUser);
userRouter.post('/signin', authReq({json: true, UID: true}), signIn);
userRouter.post('/signup', authReq({json: true, UID: true}), signUp);
userRouter.post('/update', authReq({json: true, UID: true, token: true}), updateUser);
userRouter.post('/delete', authReq({UID: true, token: true}), deleteUser);