import express from 'express';
import mongoose from 'mongoose';
import { MongoError } from 'mongodb';
import bodyParser from 'body-parser';

const app = express();
const mongoURI: string = process.env.MONGOURI || 'mongodb://127.0.0.1:27017/authsys';
const PORT = process.env.PORT || 4000;

mongoose.connect(mongoURI, {useNewUrlParser: true}, (err: MongoError) => {
  if (err) {
    throw err;
  }

  console.log('Successfully connected to database.');
});

app.use(bodyParser.json());
app.use(bodyParser({extended: true}));

app.listen(PORT, (err: Error) => {
  if (err) {
    throw err;
  } else {
    console.log(`Server is listening on port ${PORT}`);
  }
})