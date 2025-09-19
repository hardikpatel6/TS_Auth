import express from "express";
import dotenv from "dotenv";
import main from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import videoRouter from "./routes/videoRoutes.js";
const app = express();
dotenv.config();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
main();
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
