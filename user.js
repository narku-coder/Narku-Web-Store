const mongoose = require('mongoose');

const User = new mongoose.model('User', new mongoose.Schema(
	{
		firstName: String,
		lastName: String,
		emailAddress: String,
		cart: mongoose.SchemaTypes.ObjectId
	}))

module.exports = User;