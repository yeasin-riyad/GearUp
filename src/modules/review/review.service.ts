import { createReview } from "./services/createReview.js";
import { deleteReview } from "./services/deleteReview.js";
import { getAllGearReviews } from "./services/getAllGearReviews.js";
import { getGearReviews } from "./services/getGearReviews.js";
import { getMyReviews } from "./services/getMyReviews.js";
import { updateReview } from "./services/updateReview.js";

export const reviewService = {
  createReview,
  getGearReviews,
  getMyReviews,
  updateReview,
  deleteReview,
  getAllGearReviews
};