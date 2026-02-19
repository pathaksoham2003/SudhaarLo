import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import ServiceProvider from '../models/ServiceProvider.js';
import ProviderService from '../models/ProviderService.js';

// Helper to update ratings
const updateRatings = async (providerId, serviceId, newRating) => {
    // 1. Update Provider Overall Rating
    const provider = await ServiceProvider.findById(providerId);
    if (provider) {
        const totalRating = (provider.average_rating * provider.total_reviews) + newRating;
        provider.total_reviews += 1;
        provider.average_rating = totalRating / provider.total_reviews;
        await provider.save();
    }

    // 2. Update Provider Service Specific Rating
    const ps = await ProviderService.findOne({ provider_id: providerId, service_id: serviceId });
    if (ps) {
        const psTotalRating = (ps.average_rating * ps.total_reviews) + newRating;
        ps.total_reviews += 1;
        ps.average_rating = psTotalRating / ps.total_reviews;
        await ps.save();
    }
};

// @desc    Add Review
// @route   POST /api/reviews
// @access  Private (Customer)
export const addReview = async (req, res) => {
    try {
        const { booking_id, rating, description } = req.body;

        if (!booking_id || !rating) {
            return res.status(400).json({ success: false, message: 'Booking ID and rating are required' });
        }

        // Check if booking exists and is COMPLETED
        const booking = await Booking.findOne({ _id: booking_id, customer_id: req.user._id });

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (booking.booking_status !== 'COMPLETED') {
            return res.status(400).json({ success: false, message: 'Only completed bookings can be reviewed' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({ booking_id });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'Review already submitted for this booking' });
        }

        const review = await Review.create({
            booking_id,
            customer_id: req.user._id,
            provider_id: booking.provider_id,
            service_id: booking.service_id,
            rating,
            description
        });

        // Update ratings
        await updateRatings(booking.provider_id, booking.service_id, rating);

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Add Review Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get Reviews for Provider
// @route   GET /api/reviews/provider/:id
// @access  Public
export const getProviderReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ provider_id: req.params.id, hidden: false })
            .populate('customer_id', 'name profile_pic')
            .populate('service_id', 'service_name')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        console.error('Get Provider Reviews Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get Reviews for a Specific Service by Provider
// @route   GET /api/reviews/provider/:provider_id/service/:service_id
// @access  Public
export const getServiceReviews = async (req, res) => {
    try {
        const { provider_id, service_id } = req.params;

        const reviews = await Review.find({
            provider_id,
            service_id,
            hidden: false
        })
            .populate('customer_id', 'name profile_pic')
            .sort({ createdAt: -1 });

        const formatted = reviews.map(r => ({
            review_id: r._id,
            rating: r.rating,
            description: r.description,
            customer_name: r.customer_id?.name,
            created_at: r.createdAt.toISOString().split('T')[0]
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error('Get Service Reviews Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
