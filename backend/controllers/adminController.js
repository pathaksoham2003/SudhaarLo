import User from '../models/User.js';
import ServiceCategory from '../models/ServiceCategory.js';
import Service from '../models/Service.js';
import ServiceProvider from '../models/ServiceProvider.js';
import Booking from '../models/Booking.js';
import SystemSetting from '../models/SystemSetting.js';

// @desc    List Users by Role
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) {
            query.role = role;
        }

        const users = await User.find(query).select('-password -otp -otpExpiry');
        res.status(200).json(users);
    } catch (error) {
        console.error('Admin List Users Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get All Categories (Admin)
// @route   GET /api/admin/categories
// @access  Private (Admin)
export const getCategories = async (req, res) => {
    try {
        const categories = await ServiceCategory.find({}).sort({ createdAt: -1 });
        res.status(200).json(categories);
    } catch (error) {
        console.error('Admin Get Categories Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Create Service Category
// @route   POST /api/admin/categories
// @access  Private (Admin)
export const createCategory = async (req, res) => {
    try {
        const { category_name, description, icon } = req.body;

        if (!category_name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const category = await ServiceCategory.create({
            category_name,
            description,
            icon
        });

        res.status(201).json({
            success: true,
            category
        });
    } catch (error) {
        console.error('Admin Create Category Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get All Services (Admin)
// @route   GET /api/admin/services
// @access  Private (Admin)
export const getServices = async (req, res) => {
    try {
        const services = await Service.find({}).populate('category_id', 'category_name').sort({ createdAt: -1 });
        res.status(200).json(services);
    } catch (error) {
        console.error('Admin Get Services Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Add Service to Category
// @route   POST /api/admin/services
// @access  Private (Admin)
export const createService = async (req, res) => {
    try {
        const { category_id, service_name, description, basePrice, photo, active } = req.body;

        if (!category_id || !service_name || !basePrice) {
            return res.status(400).json({ success: false, message: 'Category ID, Service name, and Base Price are required' });
        }

        const category = await ServiceCategory.findById(category_id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        const service = await Service.create({
            category_id,
            service_name,
            description,
            basePrice,
            photo,
            active
        });

        res.status(201).json({
            success: true,
            service
        });
    } catch (error) {
        console.error('Admin Create Service Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get Expired Subscriptions
// @route   GET /api/admin/subscriptions/expired
// @access  Private (Admin)
export const getExpiredSubscriptions = async (req, res) => {
    try {
        const currentDate = new Date();
        const providers = await ServiceProvider.find({
            'subscription.expiry_date': { $lt: currentDate },
            'subscription.active': true
        }).populate('user_id', 'name phone');

        res.status(200).json(providers);
    } catch (error) {
        console.error('Admin Expired Subscriptions Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
    try {
        const total_customers = await User.countDocuments({ role: 'CUSTOMER' });
        const total_providers = await User.countDocuments({ role: 'SERVICE_PROVIDER' });

        const active_bookings = await Booking.countDocuments({
            booking_status: { $in: ["PENDING", "APPROVED", "IN_PROGRESS"] }
        });

        res.status(200).json({
            total_customers,
            total_providers,
            active_bookings
        });
    } catch (error) {
        console.error('Admin Dashboard Stats Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get System Setting
// @route   GET /api/admin/settings/:key
// @access  Private (Admin)
export const getSystemSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const setting = await SystemSetting.findOne({ key: key.toUpperCase() });

        if (!setting) {
            return res.status(404).json({ success: false, message: 'Setting not found' });
        }

        res.status(200).json(setting);
    } catch (error) {
        console.error('Get System Setting Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update System Setting
// @route   PUT /api/admin/settings/:key
// @access  Private (Admin)
export const updateSystemSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value, description } = req.body;

        const setting = await SystemSetting.findOneAndUpdate(
            { key: key.toUpperCase() },
            { value, description },
            { new: true, upsert: true } // Create if not exists
        );

        res.status(200).json({
            success: true,
            setting
        });
    } catch (error) {
        console.error('Update System Setting Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
