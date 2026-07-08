import Stripe from "stripe";
import httpStatus from "http-status";

import AppError from "../../../errors/AppError";
import { prisma } from "../../../lib/prisma";
import { updateGearStock } from "../utls/updateGearStock";


export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session
) => {
  /**
   * Find Payment
   */
  const payment = await prisma.payment.findUnique({
    where: {
      stripeSessionId: session.id,
    },
    include: {
      rentalOrder: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment not found."
    );
  }

  /**
   * Idempotency
   */
  if (payment.status !== "PENDING") {
    return;
  }

  /**
   * Payment Intent
   */
  const stripePaymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : null;

  /**
   * Transaction
   */
  await prisma.$transaction(async (tx) => {
    /**
     * Update Payment
     */
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "COMPLETED",
        paidAt: new Date(),
        stripePaymentIntentId,
      },
    });

    /**
     * Update Rental Order
     */
    await tx.rentalOrder.update({
      where: {
        id: payment.rentalOrderId,
      },
      data: {
        status: "PAID",
      },
    });

    /**
     * Update Gear Stock
     */
    await updateGearStock(
      tx,
      payment.rentalOrder.items
    );
  });
};