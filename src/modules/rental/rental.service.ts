import { confirmRental } from "./services/confirmRental";
import { createRentalOrder } from "./services/createRentalOrder";
import { getIncomingRentals } from "./services/getIncomingRentals";
import { pickupRental } from "./services/pickupRental";
import { returnRental } from "./services/returnRental";

export const rentalService = {
  createRentalOrder,
  getIncomingRentals,
  confirmRental,
  pickupRental,
  returnRental
};