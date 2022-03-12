import { combineReducers } from 'redux';
import authReducer from './authReducer';
import tokenReducer from './tokenReducer';

const reducer = combineReducers({
	auth: authReducer,
	token: tokenReducer
});
export default reducer;
