import { prisma } from "../../../lib/prisma.js";

export const getDashboard = async (providerId: string) => {
  const [
    totalGears,
    availableGears,
    unavailableGears,
    rentalOrders,
    revenue,
  ] = await Promise.all([
    prisma.gearItem.count({
      where: {
        providerId,
      },
    }),

    prisma.gearItem.count({
      where: {
        providerId,
        availability: "AVAILABLE",
      },
    }),

    prisma.gearItem.count({
      where: {
        providerId,
        availability: "UNAVAILABLE",
      },
    }),

    prisma.rentalOrder.findMany({
      where: {
        items: {
          some: {
            gearItem: {
              providerId,
            },
          },
        },
      },
      select: {
        status: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "COMPLETED",
        rentalOrder: {
          items: {
            some: {
              gearItem: {
                providerId,
              },
            },
          },
        },
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const dashboard = {
    totalGears,
    availableGears,
    unavailableGears,

    placedRentals: 0,
    paidRentals: 0,
    confirmedRentals: 0,
    pickedUpRentals: 0,
    returnedRentals: 0,
    cancelledRentals: 0,

    totalRevenue: revenue._sum.amount ?? 0,
  };

  for (const rental of rentalOrders) {
    switch (rental.status) {
      case "PLACED":
        dashboard.placedRentals++;
        break;

      case "PAID":
        dashboard.paidRentals++;
        break;

      case "CONFIRMED":
        dashboard.confirmedRentals++;
        break;

      case "PICKED_UP":
        dashboard.pickedUpRentals++;
        break;

      case "RETURNED":
        dashboard.returnedRentals++;
        break;

      case "CANCELLED":
        dashboard.cancelledRentals++;
        break;
    }
  }

  return dashboard;
};