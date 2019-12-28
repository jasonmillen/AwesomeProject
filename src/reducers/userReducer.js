import {
  GET_LOGGED_IN_USER_REQUEST,
  GET_LOGGED_IN_USER_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  COMPLETE_LOGIN_PROCESS
} from '../actions/userActions';

import {
  SET_USER_TOKEN_SUCCESS
} from '../actions/tokenActions';

const initialState = {
  accessToken: null,
  expirationTime: null,
  refreshToken: null,
  userID: null,
  getLoggedInUserSuccess: false,
  isProcessingLogin: false
};

export default userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_LOGGED_IN_USER_REQUEST: {
      console.log(GET_LOGGED_IN_USER_REQUEST);
      return {
        ...state,
        getLoggedInUserSuccess: false,
      };
    }
    case GET_LOGGED_IN_USER_SUCCESS: {
      console.log(GET_LOGGED_IN_USER_SUCCESS, action.payload.userID);
      return {
        ...state,
        userID: action.payload.userID,
        getLoggedInUserSuccess: true
      };
    }
    case LOGIN_REQUEST: {
      console.log(LOGIN_REQUEST);
      return {
        ...state,
        isProcessingLogin: true
      };
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
    case COMPLETE_LOGIN_PROCESS: {
      console.log(COMPLETE_LOGIN_PROCESS);
      return {
        ...state,
        isProcessingLogin: false
      }
    }
    case SET_USER_TOKEN_SUCCESS:
        console.log('set user token reducer');
        return {
          ...state,
          accessToken: action.payload.accessToken,
          expirationTime: action.payload.expirationTime,
          refreshToken: action.payload.refreshToken
        };
    default:
      return state;
  }
};

export const selectUserID = (state) => {
  return state.user.userID;
};

export const selectGetLoggedInUserSuccess = (state) => {
  return state.user.getLoggedInUserSuccess;
};

export const selectIsProcessingLogin = (state) => {
  return state.user.isProcessingLogin;
};

export const selectTokenData = (state) => {
  const userState = state.user;
  return {
    accessToken: userState.accessToken,
    expirationTime: userState.expirationTime,
    refreshToken: userState.refreshToken
  };
};