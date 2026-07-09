import { cancelRental } from "./services/cancelRental.js";
import { confirmRental } from "./services/confirmRental.js";
import { createRentalOrder } from "./services/createRentalOrder.js";
import { getIncomingRentals } from "./services/getIncomingRentals.js";
import { getMyRentals } from "./services/getMyRentals.js";
import { pickupRental } from "./services/pickupRental.js";
import { returnRental } from "./services/returnRental.js";

export const rentalService = {
  createRentalOrder,
  getIncomingRentals,
  confirmRental,
  pickupRental,
  returnRental,
  getMyRentals,
  cancelRental,

};