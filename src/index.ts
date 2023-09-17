import express, { Application } from "express";
import colors from "colors";
import { config } from "dotenv";
import connectDb from "./configs/db";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser = require("cookie-parser");

config();

const app: Application = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.static("uploads"));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

// import routes
import authRoute from "./routers/authRoute";
import postRoute from "./routers/postRoute";
import userRoute from "./routers/userRoute";
import commentRouter from "./routers/commentRouter";

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/comment", commentRouter);

connectDb();
const port = process.env.PORT as string;
mongoose.connection.once("open", () => {
    app.listen(port, () => console.log(colors.green(`listen on ${port} port`)));
});
