import express from 'express';
import {
    addTimelogs
} from '../controllers/user.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();


router.route('/time-log').post([protect, authorize('user'), addTimelogs])

export default router;