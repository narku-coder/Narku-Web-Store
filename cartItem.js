const mongoose = require('mongoose');

const CartItem = mongoose.model('CartItem', new mongoose.Schema(
{
	name: String,
	quantity: Number
}))

module.exports = CartItem;
