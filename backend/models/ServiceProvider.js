import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    business_name: String,
    description: String,
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    address: {
        state: String,
        city: String,
        pincode: String
    },
    contact_no: String,
    home_service_available: Boolean,
    total_bookings: {
        type: Number,
        default: 0
    },
    subscription: {
        active: {
            type: Boolean,
            default: false
        },
        start_date: Date,
        expiry_date: Date,
        amount: Number
    },
    photos: [String]
}, { timestamps: true });

serviceProviderSchema.index({ location: "2dsphere" });

const ServiceProvider = mongoose.model("ServiceProvider", serviceProviderSchema);
export default ServiceProvider;
