import { cancelRental } from "./services/cancelRental";
import { confirmRental } from "./services/confirmRental";
import { createRentalOrder } from "./services/createRentalOrder";
import { getIncomingRentals } from "./services/getIncomingRentals";
import { getMyRentals } from "./services/getMyRentals";
import { pickupRental } from "./services/pickupRental";
import { returnRental } from "./services/returnRental";

export const rentalService = {
  createRentalOrder,
  getIncomingRentals,
  confirmRental,
  pickupRental,
  returnRental,
  getMyRentals,
  cancelRental,

};