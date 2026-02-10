import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["ADMIN", "SERVICE_PROVIDER", "CUSTOMER"],
        required: true
    },
    name: String,
    phone: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    profile_pic: String,
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
