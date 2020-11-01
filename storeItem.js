const mongoose = require('mongoose');

const StoreItem = mongoose.model('StoreItem', new mongoose.Schema(
{
	name: String
}))

module.exports = StoreItem;