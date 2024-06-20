const Product = require('../models/item');

const getProducts = async (req, res) => {
    try {
        const data = await Product.find({});
        res.render('index', {data})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProducts
};
