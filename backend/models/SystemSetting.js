import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Can be string, object, etc.
        required: true
    },
    description: String
}, { timestamps: true });

const SystemSetting = mongoose.model("SystemSetting", systemSettingSchema);
export default SystemSetting;
