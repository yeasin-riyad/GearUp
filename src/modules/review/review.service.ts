import { createReview } from "./services/createReview";
import { deleteReview } from "./services/deleteReview";
import { getGearReviews } from "./services/getGearReviews";
import { getMyReviews } from "./services/getMyReviews";
import { updateReview } from "./services/updateReview";

export const reviewService = {
  createReview,
  getGearReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};