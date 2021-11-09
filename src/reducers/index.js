import { combineReducers } from 'redux';
import userReducer from './userReducer';
import searchReducer from './searchReducer';
import groupReducer from './groupReducer';
import messageReducer from './messageReducer';
import friendReducer from './friendReducer';

// export default combineReducers({
//   user: userReducer,
//   search: searchReducer,
//   group: groupReducer,
//   message: messageReducer,
//   friend: friendReducer
// });

export const allReducers = (state = null, action) => {
  const user = userReducer(state?.user, action);
  const search = searchReducer(state?.search, action);
  const group = groupReducer(state?.group, action);
  const message = messageReducer(state?.message, action);
  const friend = friendReducer(state?.friend, action, state?.user?.spotifyUserID);

  return { user, search, group, message, friend };
};