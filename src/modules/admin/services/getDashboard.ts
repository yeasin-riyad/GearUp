import { prisma } from "../../../lib/prisma";

export const getDashboard = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,

    totalCategories,
    totalGears,
    availableGears,
    unavailableGears,

    totalRentalOrders,

    placedRentals,
    paidRentals,
    confirmedRentals,
    pickedUpRentals,
    returnedRentals,
    cancelledRentals,

    totalPayments,
    completedPayments,
    pendingPayments,
    failedPayments,

    revenue,
  ] = await Promise.all([
    /**
     * Users
     */
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
      },
    }),

    prisma.user.count({
      where: {
        role: "PROVIDER",
      },
    }),

    /**
     * Categories & Gears
     */
    prisma.category.count(),

    prisma.gearItem.count(),

    prisma.gearItem.count({
      where: {
        availability: "AVAILABLE",
      },
    }),

    prisma.gearItem.count({
      where: {
        availability: "UNAVAILABLE",
      },
    }),

    /**
     * Rentals
     */
    prisma.rentalOrder.count(),

    prisma.rentalOrder.count({
      where: {
        status: "PLACED",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "PAID",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "PICKED_UP",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "RETURNED",
      },
    }),

    prisma.rentalOrder.count({
      where: {
        status: "CANCELLED",
      },
    }),

    /**
     * Payments
     */
    prisma.payment.count(),

    prisma.payment.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.payment.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.payment.count({
      where: {
        status: "FAILED",
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  return {
    users: {
      totalUsers,
      totalCustomers,
      totalProviders,
    },

    categories: {
      totalCategories,
    },

    gears: {
      totalGears,
      availableGears,
      unavailableGears,
    },

    rentals: {
      totalRentalOrders,
      placedRentals,
      paidRentals,
      confirmedRentals,
      pickedUpRentals,
      returnedRentals,
      cancelledRentals,
    },

    payments: {
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
    },

    revenue: {
      totalRevenue: revenue._sum.amount ?? 0,
    },
  };
};