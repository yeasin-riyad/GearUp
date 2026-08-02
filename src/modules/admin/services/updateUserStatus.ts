import AppError from "../../../errors/AppError.js";
import { prisma } from "../../../lib/prisma.js";

export const updateUserStatus = async (id: string, status: "ACTIVE" | "SUSPENDED") => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return prisma.user.update({
    where: {
      id,
    },

    data: {
      status,
    },

    select: {
      id: true,
      name: true,
      email: true,
      status: true,
    },
  });
};
