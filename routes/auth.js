import express from 'express';
import {
    createUser,
    signin
} from '../controllers/auth.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();


router.route('/signup').post([
    // protect,
    // authorize('admin'), 
    createUser])

router.route('/signin').post(signin)

export default router;