import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	useHistory,
	useLocation
} from 'react-router-dom';
import Activate from './components/Activate';
import Admin from './components/Admin';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import Login from './components/Login';
import Private from './components/Private';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import { actFetch, actGetUser, actLogin, actToken } from './redux/Action';
axios.defaults.withCredentials = true;

const App = () => {
	const auth = useSelector(state => state.auth);
	const token = useSelector(state => state.token);
	const dispatch = useDispatch();

	useEffect(() => {
		const firstLogin = sessionStorage.getItem('firstLogin');
		if (firstLogin) {
			const getRefreshToken = async () => {
				try {
					const res = await axios.post(
						'http://localhost:5000/user/refresh_token',
						null
					);
					dispatch(actToken(res.data.access_token));
				} catch (error) {
					console.log(error.response);
				}
			};
			getRefreshToken();
		}
	}, [auth.isLogged, dispatch]);
	useEffect(() => {
		if (token) {
			const getUser = () => {
				dispatch(actLogin());
				return actFetch(token).then(res => dispatch(actGetUser(res)));
			};
			getUser();
		}
	}, [token, dispatch]);

	return (
		<Router>
			<Switch>
				<Route path="/" exact render={props => <Home {...props} />} />
				<Route path="/login" exact render={props => <Login {...props} />} />
				<Route
					path="/register"
					exact
					render={props => <Register {...props} />}
				/>
				<Route
					path="/user/password/forget"
					exact
					render={props => <ForgotPassword {...props} />}
				/>
				<Route
					path="/user/password/reset/:token"
					exact
					render={props => <ResetPassword {...props} />}
				/>
				<Route
					path="/user/activate/:activation"
					exact
					render={props => <Activate {...props} />}
				/>
				<Route path="/private" exact component={Private} />
				<Route path="/admin" exact component={Admin} />
			</Switch>
		</Router>
	);
};

export default App;
