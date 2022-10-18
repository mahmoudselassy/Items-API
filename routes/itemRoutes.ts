import express from 'express';
import { filterItemsByCount, setThumbnail, validateRequestBody } from '../controllers/itemController';

const router = express.Router();

router.route('/').post(validateRequestBody, filterItemsByCount, setThumbnail);

export { router };
