"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const videoRoutes_1 = __importDefault(require("./routes/videoRoutes"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT || 4000;
app.use(express_1.default.json());
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/videos", videoRoutes_1.default);
(0, db_1.default)();
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
