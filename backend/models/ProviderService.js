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
    price_range: {
        min: Number,
        max: Number
    },
    rough_duration_minutes: Number,
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

providerServiceSchema.index({ provider_id: 1 });
providerServiceSchema.index({ service_id: 1 });

const ProviderService = mongoose.model("ProviderService", providerServiceSchema);
export default ProviderService;
