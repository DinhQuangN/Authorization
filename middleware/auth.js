const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
	try {
		const token = req.header('Authorization');
		if (!token) {
			return res.status(400).json({ message: 'Invalid Authorization' });
		}
		jwt.verify(token, process.env.ACCESS, (err, user) => {
			if (err) {
				return res.status(400).json({ message: 'Invalid Authorization' });
			}
			req.user = user;
			next();
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
module.exports = auth;
