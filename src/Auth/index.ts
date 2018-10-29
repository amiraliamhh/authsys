import jwt from 'jsonwebtoken';

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