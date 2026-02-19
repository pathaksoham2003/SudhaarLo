import mongoose from "mongoose";

const providerServiceSchema = new mongoose.Schema({
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
    price_range: String,
    min_price: Number,
    max_price: Number,
    rough_duration: String,
    is_enabled: {
        type: Boolean,
        default: true
    },
    average_rating: {
        type: Number,
        default: 0
    },
    total_reviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

providerServiceSchema.index({ provider_id: 1 });
providerServiceSchema.index({ service_id: 1 });

const ProviderService = mongoose.model("ProviderService", providerServiceSchema);
export default ProviderService;
