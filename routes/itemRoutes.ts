import express from 'express';
import { filterByCount, setThumbnail, validatePayload } from '../controllers/itemController';

const router = express.Router();

router.route('/').post(validatePayload, filterByCount, setThumbnail);

export { router };
