import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const Home = () => {
	const auth = useSelector(state => state.auth);
	const handleSignOut = async () => {
		try {
			await axios.get('http://localhost:5000/user/logout');
			sessionStorage.removeItem('firstLogin');
			window.location.href = '/';
		} catch (error) {
			window.location.href = '/';
		}
	};
	return (
		<div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
			<ToastContainer />
			<div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
				<div className="lg:w-1/2 xl:w-8/12 p-6 sm:p-12">
					<div className="mt-12 flex flex-col items-center">
						<h1 className="text-2xl xl:text-2xl font-extrabold  text-center ">
							Ultimate Auth with Email & Facebook & Google with diferent roles,
							email verification & Forget passwored{' '}
						</h1>
						<div className="w-full flex-1 mt-8 text-indigo-500">
							<div className="my-12 border-b text-center">
								{auth.isLogged ? (
									<>
										<img
											src={auth.user.avatar}
											alt={auth.user.name}
											style={{
												width: '150px',
												height: '150px',
												borderRadius: '50%',
												margin: 'auto'
											}}
										/>
										<h2
											className="font-extrabold"
											style={{
												marginTop: '20px',
												textAlign: 'center',
												textTransform: 'capitalize',
												fontSize: '25px',
												color: 'black'
											}}
										>
											{auth.user.name}
										</h2>
									</>
								) : (
									''
								)}
								<div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
									Features
								</div>
							</div>
							<div className="mx-auto max-w-xs relative ">
								{auth.isLogged ? (
									' '
								) : (
									<>
										<Link
											to="/login"
											className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
										>
											<i className="fas fa-sign-in-alt  w-6  -ml-2" />
											<span className="ml-3">Sign In</span>
										</Link>
										<Link
											to="/register"
											className="mt-5 tracking-wide font-semibold bg-gray-500 text-gray-100 w-full py-4 rounded-lg hover:bg-gray-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
										>
											<i className="fas fa-user-plus  w-6  -ml-2" />
											<span className="ml-3">Sign Up</span>
										</Link>
									</>
								)}
								<Link
									to="/private"
									className="mt-5 tracking-wide font-semibold bg-orange-500 text-gray-100 w-full py-4 rounded-lg hover:bg-orange-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
								>
									<i className="fas fa-sign-in-alt  w-6  -ml-2" />
									<span className="ml-3">Profile Dashbaord</span>
								</Link>
								{auth.isAdmin ? (
									<Link
										to="/admin"
										className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
									>
										<i className="fas fa-sign-in-alt  w-6  -ml-2" />
										<span className="ml-3">Admin Dashbaord</span>
									</Link>
								) : (
									''
								)}

								<button
									className="mt-5 tracking-wide font-semibold bg-pink-500 text-gray-100 w-full py-4 rounded-lg hover:bg-pink-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
									onClick={handleSignOut}
								>
									<i className="fas fa-sign-out-alt  w-6  -ml-2" />
									<span className="ml-3">Signout</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
