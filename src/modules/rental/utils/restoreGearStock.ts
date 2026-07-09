import { Prisma } from "@prisma/client";

type RentalItems = Prisma.RentalOrderGetPayload<{
  include: {
    items: {
      include: {
        gearItem: true;
      };
    };
  };
}>["items"];

export const restoreGearStock = async (
  tx: Prisma.TransactionClient,
  items: RentalItems
) => {
  for (const item of items) {
    const updatedGear = await tx.gearItem.update({
      where: {
        id: item.gearItemId,
      },
      data: {
        stock: {
          increment: item.quantity,
        },
      },
      select: {
        id: true,
        stock: true,
      },
    });

    if (updatedGear.stock > 0) {
      await tx.gearItem.update({
        where: {
          id: updatedGear.id,
        },
        data: {
          availability: "AVAILABLE",
        },
      });
    }
  }
};