import express from "express";
import dotenv from "dotenv";
import main from "./config/db.ts";
import userRouter from "./routes/userRoutes.ts";
import videoRouter from "./routes/videoRoutes.ts";

const app = express();
dotenv.config();
const port: number | string = process.env.PORT || 4000;

app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);

main();

app.listen(port, (): void => {
    console.log(`Server is listening on port ${port}`)
});