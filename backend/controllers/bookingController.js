import Booking from '../models/Booking.js';
import ServiceProvider from '../models/ServiceProvider.js';
import Service from '../models/Service.js';

// @desc    Create Booking
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req, res) => {
    try {
        const { service_id, provider_id, booking_date, address } = req.body;

        if (!service_id || !provider_id || !booking_date || !address) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Verify provider exists
        const provider = await ServiceProvider.findById(provider_id);
        if (!provider) {
            return res.status(404).json({ success: false, message: 'Service Provider not found' });
        }

        const booking = await Booking.create({
            customer_id: req.user._id,
            provider_id,
            service_id,
            booking_date,
            address
        });

        res.status(201).json({
            booking_id: booking._id,
            status: booking.booking_status
        });
    } catch (error) {
        console.error('Create Booking Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Customer Booking List
// @route   GET /api/bookings/my
// @access  Private (Customer)
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customer_id: req.user._id })
            .populate('provider_id', 'business_name')
            .populate('service_id', 'service_name')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get My Bookings Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Provider Booking Requests
// @route   GET /api/bookings/provider
// @access  Private (Service Provider)
export const getProviderBookings = async (req, res) => {
    try {
        const { status } = req.query;

        const provider = await ServiceProvider.findOne({ user_id: req.user._id });
        if (!provider) {
            return res.status(404).json({ success: false, message: 'Provider profile not found' });
        }

        let query = { provider_id: provider._id };
        if (status) {
            query.booking_status = status;
        }

        const bookings = await Booking.find(query)
            .populate('customer_id', 'name phone')
            .populate('service_id', 'service_name')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get Provider Bookings Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update Booking Status
// @route   PUT /api/bookings/:id/status
// @access  Private (Service Provider)
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["APPROVED", "CANCELLED", "COMPLETED", "IN_PROGRESS", "REJECTED"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const provider = await ServiceProvider.findOne({ user_id: req.user._id });
        const booking = await Booking.findOne({ _id: req.params.id, provider_id: provider?._id });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.booking_status = status;
        await booking.save();

        res.status(200).json({
            success: true,
            message: `Booking ${status.toLowerCase()} successfully`
        });
    } catch (error) {
        console.error('Update Booking Status Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get All Bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('customer_id', 'name phone')
            .populate('provider_id', 'business_name contact_no')
            .populate('service_id', 'service_name')
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        console.error('Get All Bookings Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
