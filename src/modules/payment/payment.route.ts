import express from "express";
import auth from "../../middlewares/auth.js";
import { paymentController } from "./payment.controller.js";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/checkout-session/:rentalOrderId",
  auth(UserRole.CUSTOMER),
  paymentController.createCheckoutSession
);

router.post(
  "/webhook",
  paymentController.stripeWebhook
);

export const paymentRoutes = router;