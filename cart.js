const mongoose = require('mongoose');

const Cart = mongoose.model('Cart', new mongoose.Schema(
	{
		items: [mongoose.SchemaTypes.ObjectId]
	}))

module.exports = Cart;