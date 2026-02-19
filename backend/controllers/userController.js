import User from '../models/User.js';

// @desc    Get logged-in user profile
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -otp -otpExpiry');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            verified: user.verified,
            city: user.city,
            state: user.state,
            pincode: user.pincode
        });
    } catch (error) {
        console.error('Get User Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update profile
// @route   PUT /api/users/me
// @access  Private
export const updateUserProfile = async (req, res) => {
    try {
        const { name, city, state, pincode } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = name || user.name;
        user.city = city || user.city;
        user.state = state || user.state;
        user.pincode = pincode || user.pincode;
        user.profile_completed = true;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated'
        });
    } catch (error) {
        console.error('Update User Profile Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
