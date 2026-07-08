import { createCheckoutSession } from "./services/createCheckoutSession";
import { stripeWebhook } from "./services/stripeWebhook";

export const paymentService = {
  createCheckoutSession,
  stripeWebhook,
};