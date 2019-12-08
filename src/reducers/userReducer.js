import {
  GET_LOGGED_IN_USER_REQUEST,
  GET_LOGGED_IN_USER_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS
} from '../actions/userActions';

const initialState = {
  accessToken: null,
  expirationTime: null,
  refreshToken: null,
  userID: null
};

export default userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOGGED_IN_USER_REQUEST: {
      console.log(GET_LOGGED_IN_USER_REQUEST);
      return state;
    }
    case GET_LOGGED_IN_USER_SUCCESS: {
      console.log(GET_LOGGED_IN_USER_SUCCESS);
      return state;
    }
    case LOGIN_REQUEST: {
      console.log(LOGIN_REQUEST);
      return state;
    }
    case LOGIN_SUCCESS: {
      console.log(LOGIN_SUCCESS);
      const tokenData = action.payload.tokenData;
      return {
        ...state,
        accessToken: tokenData.accessToken,
        expirationTime: tokenData.expirationTime,
        refreshToken: tokenData.refreshToken,
        userID: action.payload.userID
      };
    }
    default:
      return state;
  }
};

export const selectUserID = (state) => {
  return state.user.userID;
}