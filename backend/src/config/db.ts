import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DB_URL : string  = process.env.DB_URL || 'mongodb://127.0.0.1:27017/TSAUTH';
async function main() : Promise<void> {
  await mongoose.connect(DB_URL);
}
main()
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch(err => console.log(err));

export default main;