import { createCheckoutSession } from "./services/createCheckoutSession.js";
import { stripeWebhook } from "./services/stripeWebhook.js";

export const paymentService = {
  createCheckoutSession,
  stripeWebhook,
};