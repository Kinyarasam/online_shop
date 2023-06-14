#!/usr/bin/env node
import express from 'express';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();   /* Load environment variables */

const app = express();
const PORT = process.env.PORT || 7000

/* Middleware */
app.use(express.json());
app.use('/', router);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
  })
};

startServer();