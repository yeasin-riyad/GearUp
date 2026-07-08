import { createCheckoutSession } from "./services/createCheckoutSession";
import { stripeWebhook } from "./services/stripeWebhook";
import { cancelPayment } from "./services/cancelPayment";

export const paymentService = {
  createCheckoutSession,
  stripeWebhook,
  cancelPayment,
};