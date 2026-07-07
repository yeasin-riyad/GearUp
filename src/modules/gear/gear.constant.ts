import { UserRole } from "../../../generated/prisma/enums";

export const gearSearchableFields = [
  "name",
  "brand",
];

export const gearFilterableFields = [
  "categoryId",
  "brand",
  "availability",
  "pricePerDay",
];

export const gearSortableFields = [
  "createdAt",
  "pricePerDay",
  "stock",
  "name",
];

export const gearSelectableFields = [
  "id",
  "name",
  "description",
  "brand",
  "image",
  "pricePerDay",
  "stock",
  "availability",
  "createdAt",
];

export const GEAR_MANAGEMENT_ROLES:UserRole[] = [
  UserRole.ADMIN,
  UserRole.PROVIDER
];