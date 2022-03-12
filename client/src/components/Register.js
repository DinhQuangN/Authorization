import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {
	const [formData, setFormData] = useState({
		email: '',
		name: '',
		password: '',
		confirmPassword: '',
		textChange: 'Sign Up'
	});
	const { email, name, password, confirmPassword } = formData;
	const authSvg =
		'https://raw.githubusercontent.com/Mohammed-Abdelhady/FULL-MERN-AUTH-Boilerplate/588f77e6b490878c99a4506821fd19e4e458b081/client-react/src/assests/auth.svg';
	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const res = await axios.post('http://localhost:5000/user/register', {
				name,
				email,
				password,
				confirmPassword
			});
			console.log(res);
			toast.success(res.data.msg);
		} catch (error) {
			console.log(error.response);
		}
	};
	return (
		<div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
			{/* {isAuth() ? <Redirect to='/' /> : null} */}
			<ToastContainer />
			<div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
				<div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
					<div className="mt-12 flex flex-col items-center">
						<h1 className="text-2xl xl:text-3xl font-extrabold">
							Sign Up for Congar
						</h1>

						<form
							className="w-full flex-1 mt-8 text-indigo-500"
							onSubmit={handleSubmit}
						>
							<div className="mx-auto max-w-xs relative ">
								<input
									className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
									type="text"
									placeholder="Name"
									value={name}
									onChange={value =>
										setFormData({ ...formData, name: value.target.value })
									}
									// onChange={handleChange('name')}
									// value={name}
								/>
								<input
									className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
									type="email"
									placeholder="Email"
									value={email}
									onChange={value =>
										setFormData({ ...formData, email: value.target.value })
									}
									// onChange={handleChange('email')}
									// value={email}
								/>
								<input
									className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
									type="password"
									placeholder="Password"
									value={password}
									onChange={value =>
										setFormData({ ...formData, password: value.target.value })
									}
									// onChange={handleChange('password1')}
									// value={password1}
								/>
								<input
									className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
									type="password"
									placeholder="Confirm Password"
									value={confirmPassword}
									onChange={value =>
										setFormData({
											...formData,
											confirmPassword: value.target.value
										})
									}
									// onChange={handleChange('password2')}
									// value={password2}
								/>
								<button
									type="submit"
									className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
								>
									<i className="fas fa-user-plus fa 1x w-6  -ml-2" />
									<span className="ml-3">{formData.textChange}</span>
								</button>
							</div>
							<div className="my-12 border-b text-center">
								<div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
									Or sign with email or social login
								</div>
							</div>
							<div className="flex flex-col items-center">
								<a
									className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
									href="/login"
									target="_self"
								>
									<i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
									<span className="ml-4">Sign In</span>
								</a>
							</div>
						</form>
					</div>
				</div>
				<div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
					<div
						className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
						style={{ backgroundImage: `url(${authSvg})` }}
					></div>
				</div>
			</div>
			;
		</div>
	);
};

export default Register;
