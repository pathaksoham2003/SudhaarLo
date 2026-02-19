import ServiceProvider from '../models/ServiceProvider.js';
import User from '../models/User.js';

// @desc    Submit Aadhar & PAN Details
// @route   POST /api/kyc/submit
// @access  Private (Service Provider)
export const submitKYCDetails = async (req, res) => {
    try {
        const { aadhar_number, pan_number, full_name } = req.body;

        if (!aadhar_number || !pan_number || !full_name) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Find or create service provider record for this user
        let provider = await ServiceProvider.findOne({ user_id: req.user._id });

        if (!provider) {
            // For now, if provider profile doesn't exist, we create a skeleton
            // In a real flow, they might have created the profile first
            provider = new ServiceProvider({
                user_id: req.user._id,
                location: { coordinates: [0, 0] } // Placeholder
            });
        }

        provider.kyc.aadhar_number = aadhar_number;
        provider.kyc.pan_number = pan_number;
        provider.kyc.full_name = full_name;
        provider.kyc.submitted = true;

        await provider.save();

        res.status(200).json({
            success: true,
            message: 'KYC details submitted'
        });
    } catch (error) {
        console.error('Submit KYC Details Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Upload KYC Documents
// @route   POST /api/kyc/upload-documents
// @access  Private (Service Provider)
export const uploadKYCDocuments = async (req, res) => {
    try {
        if (!req.files || (!req.files['aadhar_file'] && !req.files['pan_file'])) {
            return res.status(400).json({ success: false, message: 'Please upload both Aadhar and PAN files' });
        }

        const provider = await ServiceProvider.findOne({ user_id: req.user._id });

        if (!provider) {
            return res.status(404).json({ success: false, message: 'Service Provider profile not found' });
        }

        if (req.files['aadhar_file']) {
            provider.kyc.aadhar_file = req.files['aadhar_file'][0].path;
        }
        if (req.files['pan_file']) {
            provider.kyc.pan_file = req.files['pan_file'][0].path;
        }

        // 🔒 Backend logic: OCR / manual validation mock
        // For demonstration, we assume valid if files are uploaded
        // In reality, you'd use an OCR service here

        provider.kyc.verified = true;
        await provider.save();

        // Also update the User model verified status if applicable
        const user = await User.findById(req.user._id);
        if (user) {
            user.verified = true;
            await user.save();
        }

        res.status(200).json({
            success: true,
            verified: true,
            message: "Documents verified successfully"
        });
    } catch (error) {
        console.error('Upload KYC Documents Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get KYC Status
// @route   GET /api/kyc/status
// @access  Private (Service Provider)
export const getKYCStatus = async (req, res) => {
    try {
        const provider = await ServiceProvider.findOne({ user_id: req.user._id });

        if (!provider) {
            return res.status(200).json({
                verified: false,
                submitted: false
            });
        }

        res.status(200).json({
            verified: provider.kyc.verified,
            submitted: provider.kyc.submitted
        });
    } catch (error) {
        console.error('Get KYC Status Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
