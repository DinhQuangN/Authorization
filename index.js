const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRouter = require('./routers/user');

const app = express();
dotenv.config();
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(
	cors({
		origin: `${process.env.CLIENT_URL}`,
		credentials: true
	})
);
app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);

mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('Db connect successful !!!'))
	.catch(err => {
		console.log(err);
	});

const port = process.env.PORT || 8080;
app.listen(port, () => {
	console.log(`server is running ${port}`);
});
