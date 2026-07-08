import { Request } from "express";
import Stripe from "stripe";
import httpStatus from "http-status";

import config from "../../../config";
import AppError from "../../../errors/AppError";

import { handleCheckoutCompleted } from "./handleCheckoutCompleted";
import { handleCheckoutExpired } from "./handleCheckoutExpired";

const stripe = new Stripe(config.stripe_secret_key);

export const stripeWebhook = async (req: Request) => {
  /**
   * Verify Stripe Signature
   */
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Stripe signature is missing."
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      config.stripe_webhook_secret
    );
  } catch {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Invalid Stripe webhook signature."
    );
  }

  /**
   * Handle Stripe Events
   */
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;

    case "checkout.session.expired":
      await handleCheckoutExpired(
        event.data.object as Stripe.Checkout.Session
      );
      break;

    default:
      // Ignore all other events
      break;
  }
};