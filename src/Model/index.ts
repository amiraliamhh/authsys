import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import { emailValidator } from './validation';

export interface IUser {
  email: string;
  password: string;
  uids: string[];
}

export interface IUserSchema extends mongoose.Document, IUser {}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: emailValidator,
      msg: 'email validation failed'
    }
  },
  password: {
    type: String,
    required: true
  },
  uids: [{
    type: String
  }]
});

UserSchema.pre('save', function(next: Function) {
  let _this = <any>this;

  _this.email = _this.email.toLowerCase();

  bcrypt.genSalt(10)
  .then((salt: string) => {
    bcrypt.hash(_this.password, salt)
    .then((hash: string) => {
      _this.password = hash;
      next();
    })
    .catch(err => {throw err})  
  })
  .catch(err => {throw err})
});

UserSchema.pre('findOneAndUpdate', function(next: Function) {
  if (this.getUpdate().$set.password) {
    bcrypt.genSalt(10)
    .then((salt: string) => {
  
      bcrypt.hash(this.getUpdate().$set.password, salt)
      .then((hash: string) => {
        this.update({$set: {
          password: hash
        }});
  
        next();
  
      })
      .catch(err => {throw err})  
    })
    .catch(err => {throw err})
    
  } else {
    next()
  }
});

export default mongoose.model('users', UserSchema);