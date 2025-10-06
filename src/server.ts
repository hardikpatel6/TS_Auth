import express from "express";
import dotenv from "dotenv";
import main from "./config/db";
import userRouter from "./routes/userRoutes";
import videoRouter from "./routes/videoRoutes";
import commentRouter from "./routes/commentRoutes";
import fileUpload,{UploadedFile} from "express-fileupload";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
const port: number | string = process.env.PORT || 4000;

app.use(fileUpload({
    useTempFiles: true, // store files temporarily
    tempFileDir: "/tmp/",
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments",commentRouter);

main();

app.listen(port, (): void => {
    console.log(`Server is listening on ${port}`);
});