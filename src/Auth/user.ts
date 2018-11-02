import jwt from 'jsonwebtoken';

import UserModel, { IUserSchema } from '../Model/index';

export interface IJWTObj {
  email: string;
  password: string;
  uid: string;
}

export function codeJwt(payload: IJWTObj): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.PK || 'sample', {
      expiresIn: '30d'
    }, (err: Error, token: string) => {
      if (err) {
        reject(err);
      }

      resolve(token);
    });
  });
}

export function decodeJwt(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      const payload = jwt.verify(token, process.env.PK || 'sample');
      resolve(payload);

    } catch(err) {
      reject(err);
    }
  });
}

export function getUserByToken(token: string, uid: string, includePassword?: boolean): Promise<any> {
  return new Promise((resolve, reject) => {
    decodeJwt(token)
    .then((payload: IJWTObj) => {

      if (includePassword) {
        UserModel.findOne({email: payload.email})
        .then((user) => {
          const iUser = <IUserSchema>user;

          if (iUser.uids.includes(uid)) {
            resolve(user);
          } else {
            reject('badUID');
          }
        })
        .catch(reject);

      } else {
        UserModel.findOne({email: payload.email})
        .select('-password')
        .then((user) => {
          const iUser = <IUserSchema>user;

          if (iUser.uids.includes(uid)) {
            resolve(user);
          } else {
            reject('badUID');
          }
        })
        .catch(reject);
      }
      
    })
    .catch(reject)
  });
}