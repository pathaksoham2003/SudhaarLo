import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["ADMIN", "SERVICE_PROVIDER", "CUSTOMER"]
    },
    name: String,
    phone: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: String,
    profile_pic: String,
    verified: {
        type: Boolean,
        default: false
    },
    profile_completed: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpiry: Date,
    city: String,
    state: String,
    pincode: String,
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
