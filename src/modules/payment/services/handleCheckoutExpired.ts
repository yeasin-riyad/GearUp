import Stripe from "stripe";

import { prisma } from "../../../lib/prisma";

export const handleCheckoutExpired = async (
  session: Stripe.Checkout.Session
) => {
  /**
   * Find Payment
   */
  const payment = await prisma.payment.findUnique({
    where: {
      stripeSessionId: session.id,
    },
  });

  /**
   * Payment Not Found
   */
  if (!payment) {
    return;
  }

  /**
   * Idempotency
   */
  if (payment.status !== "PENDING") {
    return;
  }

  /**
   * Update Payment & Rental
   */
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "FAILED",
      },
    });

    const rental = await tx.rentalOrder.findUnique({
  where: {
    id: payment.rentalOrderId,
  },
  select: {
    status: true,
  },
});

if (rental?.status === "PLACED") {
  await tx.rentalOrder.update({
    where: {
      id: payment.rentalOrderId,
    },
    data: {
      status: "CANCELLED",
    },
  });
}
  });
};