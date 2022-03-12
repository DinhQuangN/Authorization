import axios from 'axios';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const ResetPassword = () => {
	const authSVG =
		'https://raw.githubusercontent.com/Mohammed-Abdelhady/FULL-MERN-AUTH-Boilerplate/588f77e6b490878c99a4506821fd19e4e458b081/client-react/src/assests/auth.svg';
	const { token } = useParams();
	const [formData, setFormData] = useState({
		password: '',
		confirmPassword: ''
	});
	const history = useHistory();
	const { password, confirmPassword } = formData;
	const handleSubmit = async e => {
		e.preventDefault();
		try {
			await axios.post(
				'http://localhost:5000/user/reset',
				{
					password,
					confirmPassword
				},
				{ headers: { Authorization: token } }
			);
			history.push('/');
		} catch (error) {
			error.response.data.message && toast.error(error.response.data.message);
		}
	};
	return (
		<div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
			<ToastContainer />
			<div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
				<div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
					<div className="mt-12 flex flex-col items-center">
						<h1 className="text-2xl xl:text-3xl font-extrabold">
							Reset Your Password
						</h1>
						<div className="w-full flex-1 mt-8 text-indigo-500">
							<form
								className="mx-auto max-w-xs relative "
								onSubmit={handleSubmit}
							>
								<input
									className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
									type="password"
									placeholder="password"
									value={password}
									onChange={value =>
										setFormData({ ...formData, password: value.target.value })
									}
								/>
								<input
									className="w-full mt-5 px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
									type="password"
									placeholder="Confirm password"
									value={confirmPassword}
									onChange={value =>
										setFormData({
											...formData,
											confirmPassword: value.target.value
										})
									}
								/>
								<button
									type="submit"
									className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
								>
									<i className="fas fa-sign-in-alt  w-6  -ml-2" />
									<span className="ml-3">Submit</span>
								</button>
							</form>
						</div>
					</div>
				</div>
				<div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
					<div
						className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
						style={{ backgroundImage: `url(${authSVG})` }}
					></div>
				</div>
			</div>
			;
		</div>
	);
};

export default ResetPassword;
