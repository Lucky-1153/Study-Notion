import { Router } from "express";

const router = Router()

import {auth, isStudent} from '../middlewares/auth.middleware.js'
import { capturePayment, verifyPayment, sendPaymentSuccessEmail } from "../controllers/Payments.controller.js";

router.route('/capturePayment').post( auth, isStudent, capturePayment)
router.route('/verifyPayment').post( auth, isStudent, verifyPayment)
router.route('/senPaymentSuccessEmail').post(auth, isStudent, sendPaymentSuccessEmail)

export default router