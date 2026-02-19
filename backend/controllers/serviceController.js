import ServiceCategory from '../models/ServiceCategory.js';
import Service from '../models/Service.js';

// @desc    Get all active service categories
// @route   GET /api/services/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await ServiceCategory.find({ active: true }).select('category_name icon');

        // Map to format requested: { id, category_name }
        const formattedCategories = categories.map(cat => ({
            id: cat._id,
            category_name: cat.category_name,
            icon: cat.icon
        }));

        res.status(200).json(formattedCategories);
    } catch (error) {
        console.error('Get Categories Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get services by category
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res) => {
    try {
        const { category_id } = req.query;
        let query = { active: true };

        if (category_id) {
            query.category_id = category_id;
        }

        const services = await Service.find(query).select('service_name photo category_id');

        // Map to format requested: { id, service_name }
        const formattedServices = services.map(service => ({
            id: service._id,
            service_name: service.service_name,
            photo: service.photo,
            category_id: service.category_id
        }));

        res.status(200).json(formattedServices);
    } catch (error) {
        console.error('Get Services Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
