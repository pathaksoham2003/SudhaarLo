import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    service_name: {
        type: String,
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
        required: true
    },
    photo: String,
    description: String,
    basePrice: {
        type: Number,
        required: true,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Service = mongoose.model("Service", serviceSchema);
export default Service;
