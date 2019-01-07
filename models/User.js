const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	profession: {
		type: String
	},
	favourites: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = User = mongoose.model('users', UserSchema)