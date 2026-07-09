import { confirmRental } from "./services/confirmRental";
import { createRentalOrder } from "./services/createRentalOrder";
import { getIncomingRentals } from "./services/getIncomingRentals";
import { pickupRental } from "./services/pickupRental";

export const rentalService = {
  createRentalOrder,
  getIncomingRentals,
  confirmRental,
  pickupRental
};