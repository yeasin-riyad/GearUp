import {  UserRole } from "@prisma/client";

export const canManageGear = (
  role: UserRole,
  providerId: string,
  currentUserId: string
) => {
  if (
    role === UserRole.ADMIN ||
    role === UserRole.PROVIDER
  ) {
    return true;
  }

  return providerId === currentUserId;
};