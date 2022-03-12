const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			require: true
		},
		email: {
			type: String,
			require: true
		},
		password: {
			type: String,
			require: true
		},
		role: {
			type: Number,
			default: 0
		},
		avatar: {
			type: String,
			default:
				'https://static2.yan.vn/YanNews/2167221/202102/facebook-cap-nhat-avatar-doi-voi-tai-khoan-khong-su-dung-anh-dai-dien-e4abd14d.jpg'
		}
	},
	{ timestamps: true }
);
var User = mongoose.model('user', UserSchema);
module.exports = User;
