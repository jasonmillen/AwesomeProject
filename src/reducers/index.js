import { combineReducers } from 'redux';
import userReducer from './userReducer';
import searchReducer from './searchReducer';
import groupReducer from './groupReduer';
import messageReducer from './messageReducer';

export default combineReducers({
  user: userReducer,
  search: searchReducer,
  group: groupReducer,
  message: messageReducer
});