import { Schema,model } from "mongoose";

export interface IUser{
    name:String,
    email:String,
    password:String,
    role?: "user" | "admin"
}

const userSchema = new Schema<IUser>({
    name : {
        type : String,
        required:true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

const User = model<IUser> ('User', userSchema);

export default User;