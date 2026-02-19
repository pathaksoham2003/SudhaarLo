import ServiceProvider from '../models/ServiceProvider.js';
import ProviderService from '../models/ProviderService.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// @desc    Search service providers
// @route   GET /api/providers/search
// @access  Public
export const searchProviders = async (req, res) => {
    try {
        const { service_id, city, pincode, rating, price_min, price_max, sort } = req.query;

        let providerIds = null;

        // 1. Filter by Service and Price (via ProviderService)
        if (service_id || price_min || price_max) {
            let psQuery = { is_enabled: true };
            if (service_id) psQuery.service_id = service_id;

            if (price_min || price_max) {
                psQuery.min_price = {};
                if (price_min) psQuery.min_price.$gte = Number(price_min);
                if (price_max) psQuery.max_price = { $lte: Number(price_max) };
            }

            const psEntries = await ProviderService.find(psQuery).select('provider_id');
            providerIds = psEntries.map(ps => ps.provider_id);

            // If service filter is active but no providers found
            if (providerIds.length === 0) {
                return res.status(200).json([]);
            }
        }

        // 2. Build ServiceProvider Query
        let query = {};
        if (providerIds) {
            query._id = { $in: providerIds };
        }

        if (city) query['address.city'] = new RegExp(city, 'i');
        if (pincode) query['address.pincode'] = pincode;
        if (rating) query.average_rating = { $gte: Number(rating) };

        // 3. Sorting logic
        let sortQuery = {};
        if (sort === 'price_asc') sortQuery.min_price = 1; // Note: min_price is on ProviderService, this is complex for global sort
        else if (sort === 'price_desc') sortQuery.min_price = -1;
        else if (sort === 'popularity') sortQuery.total_bookings = -1;
        else sortQuery.average_rating = -1;

        const providers = await ServiceProvider.find(query)
            .populate('user_id', 'name')
            .sort(sortQuery);

        // 4. Format response
        const formatted = await Promise.all(providers.map(async (p) => {
            const pServices = await ProviderService.find({ provider_id: p._id, is_enabled: true })
                .populate('service_id', 'service_name');

            return {
                provider_id: p._id,
                name: p.business_name || p.user_id?.name || "Name not set",
                verified: p.kyc.verified,
                rating: p.average_rating,
                city: p.address.city,
                services: pServices.map(ps => ps.service_id.service_name)
            };
        }));

        res.status(200).json(formatted);
    } catch (error) {
        console.error('Search Providers Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get service provider details
// @route   GET /api/providers/:id
// @access  Public
export const getProviderDetails = async (req, res) => {
    try {
        const provider = await ServiceProvider.findById(req.params.id)
            .populate('user_id', 'name phone');

        if (!provider) {
            return res.status(404).json({ success: false, message: 'Provider not found' });
        }

        const pServices = await ProviderService.find({ provider_id: provider._id, is_enabled: true })
            .populate('service_id', 'service_name');

        // Fetch reviews (via bookings)
        const bookings = await Booking.find({ provider_id: provider._id }).select('_id');
        const bookingIds = bookings.map(b => b._id);
        const reviews = await Review.find({ booking_id: { $in: bookingIds } })
            .populate('customer_id', 'name profile_pic');

        res.status(200).json({
            name: provider.business_name || provider.user_id?.name,
            verified: provider.kyc.verified,
            phone: provider.contact_no || provider.user_id?.phone,
            location: {
                city: provider.address.city,
                state: provider.address.state,
                pincode: provider.address.pincode
            },
            services: pServices.map(ps => ({
                id: ps.service_id._id,
                name: ps.service_id.service_name,
                price_range: ps.price_range,
                rough_duration: ps.rough_duration
            })),
            photos: provider.photos,
            reviews: reviews.map(r => ({
                customer_name: r.customer_id?.name,
                rating: r.rating,
                comment: r.description,
                date: r.createdAt
            }))
        });
    } catch (error) {
        console.error('Get Provider Details Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
