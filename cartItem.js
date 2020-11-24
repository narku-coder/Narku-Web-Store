const mongoose = require('mongoose');

const CartItem = mongoose.model('CartItem', new mongoose.Schema(
{
	quantity: Number,
	storeItem: {type: mongoose.SchemaTypes.ObjectId, ref: 'StoreItem'}
}))

module.exports = CartItem;
