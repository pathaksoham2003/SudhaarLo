import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["SUBSCRIPTION_EXPIRY", "BOOKING_UPDATE", "GENERAL"],
        default: "GENERAL"
    },
    is_read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

notificationSchema.index({ user_id: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
