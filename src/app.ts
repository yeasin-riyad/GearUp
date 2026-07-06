import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { globalErrorHandler } from "./errors/globalErrorHandler";
import { notFound } from "./middlewares/notfound";


const app : Application = express();

app.use(cors({
    origin : config.app_url,
    credentials : true,
}))





app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser())


app.get("/",(req : Request, res : Response) => {
    res.send("Hello from GearUp API");
});



// Global error handler
app.use(notFound)
app.use(globalErrorHandler)


export default app;