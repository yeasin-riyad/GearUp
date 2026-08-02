import { getAllUsers } from "./services/getAllUsers.js";
import { getDashboard } from "./services/getDashboard.js";
import { updateUserStatus } from "./services/updateUserStatus.js";

export const adminService = {
  getDashboard,
  getAllUsers,
  updateUserStatus
};