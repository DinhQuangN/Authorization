const nodeMailer = require('nodemailer');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground';
const CLIENT_ID =
	'659231216635-i0ajisc3rghfia0sf8d6drp28er4iqup.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REFRESH_TOKEN =
	'1//04z9gJtLkt-sdCgYIARAAGAQSNwF-L9IrRePc52B7MYi_2YUOA8ku8u1ZHCdzk4jeeyPONxnYFGMWPc4PXdAm5CQlzPWCA_AEjvY';

const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, OAUTH_PLAYGROUND);

const sendEmail = (to, url, txt) => {
	oauth2Client.setCredentials({
		refresh_token: REFRESH_TOKEN
	});
	const accessToken = oauth2Client.getAccessToken();
	const transport = nodeMailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.SEND_MAIL,
			clientId: CLIENT_ID,
			clientSecret: CLIENT_SECRET,
			refreshToken: REFRESH_TOKEN,
			accessToken: accessToken
		}
	});
	const mailsOption = {
		from: process.env.SEND_MAIL,
		to: to,
		subject: 'Dinh Quang',
		html: `
    <div
			style="
				max-width: 700px;
				margin: auto;
				border: 10px solid #ddd;
				padding: 50px 20px;
				font-size: 110%;
			"
		>
			<h2 style="text-align: center; text-transform: uppercase; color: teal">
				Welcome to the Blog.
			</h2>
			<p>
				Congratulations! You're almost set to start using Blog. Just click the
				button below to validate your email address.
			</p>

			<a
				href=${url}
				style="
					background: crimson;
					text-decoration: none;
					color: white;
					padding: 10px 20px;
					margin: 10px 0;
					display: inline-block;
				"
				>${txt}</a
			>
		</div>
    `
	};
	transport.sendMail(mailsOption, (err, info) => {
		if (err) {
			console.log(err);
			return;
		}
		console.log('auth', info.response);
	});
};
module.exports = sendEmail;
