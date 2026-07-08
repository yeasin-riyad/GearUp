import express from "express";
import auth from "../../middlewares/auth";
import { paymentController } from "./payment.controller";
import { UserRole } from "../../../generated/prisma/enums";

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