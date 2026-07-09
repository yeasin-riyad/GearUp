import { Router } from "express";
import {authController } from "./auth.controller.js";
import auth from "../../middlewares/auth.js";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post(
    "/refresh-token",
    authController.refreshToken
);

router.post(
    "/logout",
    authController.logoutUser
)

router.get(
  "/me",
  auth(),
  authController.getMe
);

router.patch(
  "/profile",
  auth(),
  authController.updateProfile
);

router.patch(
  "/change-password",
  auth(),
  authController.changePassword
);

export const authRoutes = router;