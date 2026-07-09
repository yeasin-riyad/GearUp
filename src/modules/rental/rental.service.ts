import { createRentalOrder } from "./services/createRentalOrder";
import { getIncomingRentals } from "./services/getIncomingRentals";

export const rentalService = {
  createRentalOrder,
  getIncomingRentals,
};