import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config/index.js";
import { globalErrorHandler } from "./errors/globalErrorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { authRoutes } from "./modules/auth/auth.route.js";
import { categoryRoutes } from "./modules/category/category.route.js";
import { gearRoutes } from "./modules/gear/gear.route.js";
import { rentalRoutes } from "./modules/rental/rental.route.js";
import { paymentRoutes } from "./modules/payment/payment.route.js";
import { providerRoutes } from "./modules/provider/provider.route.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { reviewRoutes } from "./modules/review/review.route.js";


const app : Application = express();

app.use(cors({
    origin : config.client_url,
    credentials : true,
}))

app.use(
  "/api/payments/webhook",
  express.raw({ type: "application/json" })
);



app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser())


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GearUp API is running."
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories",categoryRoutes)
app.use("/api/gears", gearRoutes);
app.use("/api/rentals",rentalRoutes)
app.use("/api/payments",paymentRoutes)
app.use("/api/providers", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reviews", reviewRoutes);


// Global error handler
app.use(notFound)
app.use(globalErrorHandler)


export default app;