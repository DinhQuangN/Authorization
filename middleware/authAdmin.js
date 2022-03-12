const UserMessage = require('../models/user');

const authAdmin = async (req, res, next) => {
	try {
		const user = await UserMessage.findOne({ _id: req.user.id });
		if (user.role !== 1) {
			return res
				.status(500)
				.json({ message: 'Admin resources access denied.' });
		}
		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
module.exports = authAdmin;
