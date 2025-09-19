var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DB_URL = process.env.DB_URL || 'mongodb://127.0.0.1:27017/TSAUTH';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose.connect(DB_URL);
    });
}
main()
    .then(() => {
    console.log("Database Connected Successfully");
})
    .catch(err => console.log(err));
export default main;
