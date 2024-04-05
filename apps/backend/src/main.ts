import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import accountRouter from './routes/account';
import questionsRouter from './routes/questions';
import { ErrorRequestHandler } from 'express';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log(process.env.DB_URI);

const PORT = process.env.PORT ?? 8000;

const app = express();

app.use(express.json());

// use cookies
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
}));

// define root route
app.get('/api/hello', (_, res) => {
  res.json({ message: 'Hello, frontend!' });
});

// routes
app.use('/api/account', accountRouter);
app.use('/api/questions', questionsRouter);

// error handler
const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).send({ message: err.message || 'An unexpected error occurred' });
};

app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/CIS1962')
  .then(() => {
    console.log('Connected to MongoDB locally...');
    app.listen(PORT, () => {
      console.log(`Now listening on port ${PORT}.`);
    });
  })
  .catch(err => console.error('Could not connect to MongoDB:', err));
