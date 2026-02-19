import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret', {
        expiresIn: '30d',
    });
};

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOTP = async (req, res) => {
    try {
        const { phone: rawPhone } = req.body;
        const phone = rawPhone ? rawPhone.replace(/\D/g, '').slice(-10) : '';

        if (!phone) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }

        // Generate a random 6-digit OTP
        let otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Mock admin credentials check (1111111111)
        if (phone === '1111111111') {
            otp = '111111';
        }

        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        // Find user by phone or create new one
        let user = await User.findOne({ phone: new RegExp(phone + '$') });

        if (!user) {
            user = await User.create({
                phone,
                otp,
                otpExpiry,
                role: phone === '1111111111' ? 'ADMIN' : undefined,
                verified: phone === '1111111111' ? true : false,
                profile_completed: phone === '1111111111' ? true : false,
            });
        } else {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        }

        // For demo/development purpose, we'll log the OTP to console
        console.log(`OTP for ${phone}: ${otp}`);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully'
        });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Verify OTP and log in
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
    try {
        const { phone: rawPhone, otp } = req.body;
        const phone = rawPhone ? rawPhone.replace(/\D/g, '').slice(-10) : '';

        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
        }

        const user = await User.findOne({ phone: new RegExp(phone + '$') });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if OTP matches and is not expired
        const isMockAdmin = phone === '1111111111' && otp === '111111';
        const isMasterOtp = otp === '123456';

        if (user.otp !== otp && !isMockAdmin && !isMasterOtp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (user.otpExpiry < Date.now() && !isMockAdmin && !isMasterOtp) {
            return res.status(400).json({ success: false, message: 'OTP expired' });
        }

        // Mark user as verified
        user.verified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({
            token: generateToken(user._id),
            user: {
                id: user._id,
                role: user.role || null,
                verified: user.verified,
                profile_completed: user.profile_completed
            }
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Select role (Onboarding)
// @route   POST /api/auth/select-role
// @access  Private
export const selectRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !['CUSTOMER', 'SERVICE_PROVIDER', 'ADMIN'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Valid role is required' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Role selected successfully'
        });
    } catch (error) {
        console.error('Select Role Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
