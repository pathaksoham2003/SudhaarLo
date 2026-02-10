import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    provider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
        required: true
    },
    service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    service_date: {
        type: Date,
        required: true
    },
    service_time: {
        type: String,
        required: true
    },
    booking_status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
        default: "PENDING"
    },
    payment_status: {
        type: String,
        enum: ["PENDING", "SUCCESSFUL", "FAILED"],
        default: "PENDING"
    }
}, { timestamps: true });

bookingSchema.index({ customer_id: 1 });
bookingSchema.index({ provider_id: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
