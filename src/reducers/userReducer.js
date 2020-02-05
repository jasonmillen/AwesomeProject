import {
  GET_LOGGED_IN_USER_REQUEST,
  GET_LOGGED_IN_USER_ERROR,
  GET_LOGGED_IN_USER_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  COMPLETE_LOGIN_PROCESS,
  LOGOUT_REQUEST,
  LOGOUT_ERROR,
  LOGOUT_SUCCESS
} from '../actions/userActions';

import {
  SET_USER_TOKEN_SUCCESS
} from '../actions/tokenActions';

const initialState = {
  accessToken: null,
  expirationTime: null,
  refreshToken: null,
  userID: null,
  spotifyUserID: null,
  getLoggedInUserSuccess: false,
  isProcessingLogin: false,
  logoutError: false,
  logoutSuccess: null
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
    case GET_LOGGED_IN_USER_ERROR: {
      console.log(GET_LOGGED_IN_USER_ERROR);
      return state;
    }
    case GET_LOGGED_IN_USER_SUCCESS: {
      console.log(GET_LOGGED_IN_USER_SUCCESS, action.payload.spotifyUserID, action.payload.tokenData);
      const tokenData = action.payload.tokenData;
      return {
        ...state,
        userID: action.payload.userID,
        spotifyUserID: action.payload.spotifyUserID,
        accessToken: tokenData.accessToken,
        expirationTime: tokenData.expirationTime,
        refreshToken: tokenData.refreshToken,
        getLoggedInUserSuccess: true
      };
    }
    case LOGIN_REQUEST: {
      console.log(LOGIN_REQUEST);
      return {
        ...state,
        logoutSuccess: null,
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
        userID: action.payload.userID,
        spotifyUserID: action.payload.spotifyUserID
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
      console.log(SET_USER_TOKEN_SUCCESS);
      return {
        ...state,
        accessToken: action.payload.accessToken,
        expirationTime: action.payload.expirationTime,
        refreshToken: action.payload.refreshToken
      };
    case LOGOUT_REQUEST:
      console.log(LOGOUT_REQUEST);
      return {
        ...state,
        logoutError: false
      };
    case LOGOUT_ERROR: 
      console.log(LOGOUT_ERROR);
      return {
        ...state,
        logoutError: true
      };
    case LOGOUT_SUCCESS: 
      console.log(LOGOUT_SUCCESS);
      return {
        ...state,
        accessToken: null,
        expirationTime: null,
        refreshToken: null,
        userID: null,
        spotifyUserID: null,
        getLoggedInUserSuccess: false,
        isProcessingLogin: false,
        logoutError: false,
        logoutSuccess: true
      };
    default:
      return state;
  }
};

export const selectUserID = (state) => {
  return state.user.userID;
};

export const selectSpotifyUserID = (state) => {
  return state.user.spotifyUserID;
}

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

export const selectLogoutSuccess = (state) => {
  return state.user.logoutSuccess;
}