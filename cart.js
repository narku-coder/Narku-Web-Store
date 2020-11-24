const mongoose = require('mongoose');

const Cart = mongoose.model('Cart', new mongoose.Schema(
	{
		items: [{type:mongoose.SchemaTypes.ObjectId, ref: 'CartItem'}]
	}))

module.exports = Cart;