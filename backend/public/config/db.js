"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/TSAUTH';
async function main() {
    await mongoose_1.default.connect(DB_URL);
}
main()
    .then(() => {
    console.log("Database Connected Successfully");
})
    .catch(err => console.log(err));
exports.default = main;
