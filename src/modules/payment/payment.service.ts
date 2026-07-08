import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stirpe";


const createCheckoutSession = async (
  rentalOrderId: string,
  customerId: string
) => {
  /**
   * Find Rental Order
   */
  const order = await prisma.rentalOrder.findUnique({
    where: {
      id: rentalOrderId,
    },
    include: {
  customer: {
    select: {
      email: true,
      name: true,
    },
  },
  payment: true,
  items: {
    include: {
      gearItem: true,
    },
  },
},
  });

  if (!order) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Rental order not found."
    );
  }

  /**
   * Authorization
   */
  if (order.customerId !== customerId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this rental order."
    );
  }

  /**
   * Payment Exists
   */
  if (!order.payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment record not found."
    );
  }

  /**
   * Already Paid
   */
  if (order.payment.status === "COMPLETED") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This rental order has already been paid."
    );
  }

  /**
   * Empty Order
   */
  if (order.items.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Rental order contains no items."
    );
  }

  /**
   * Create Stripe Checkout Session
   */
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    customer_email:order.customer.email, // Optional: use order.customer.email if you include customer relation

    line_items: order.items.map((item) => ({
      price_data: {
        currency: "bdt",

        product_data: {
          name: item.gearItem.name,
          description: item.gearItem.description ?? undefined,
        },

        unit_amount: Math.round(item.subtotal * 100),
      },

      quantity: 1,
    })),

    success_url: `${config.client_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.client_url}/payment/cancel`,

    metadata: {
      rentalOrderId: order.id,
      paymentId: order.payment.id,
      customerId,
    },
  });

  /**
   * Save Stripe Session ID
   */
 await prisma.payment.update({
  where: {
    id: order.payment.id,
  },
  data: {
    stripeSessionId: session.id,
  },
});

  return {
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const stripeWebhook = async (req: Request) => {}

export const paymentService={
    createCheckoutSession,
    stripeWebhook
}