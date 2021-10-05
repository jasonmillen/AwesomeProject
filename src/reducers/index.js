import { combineReducers } from 'redux';
import userReducer from './userReducer';
import searchReducer from './searchReducer';
import groupReducer from './groupReducer';
import messageReducer from './messageReducer';
import friendReducer from './friendReducer';

export default combineReducers({
  user: userReducer,
  search: searchReducer,
  group: groupReducer,
  message: messageReducer,
  friend: friendReducer
});