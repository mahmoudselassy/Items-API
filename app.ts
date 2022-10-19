import express from 'express';
import { router as itemRouter } from './routes/itemRoutes';

const app = express();

app.use(express.json());

app.use('/items', itemRouter);

module.exports = app;
