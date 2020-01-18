import SpotifyWebApi from 'spotify-web-api-js';
import {
  IP
} from '../../config';
import { 
  setUserID,
  getUserID,
  saveTokenData,
  getTokenData,
  removeUserIDAndTokenData
} from '../api/asyncStorage/asyncStorage';
import { getAuthorizationCode } from '../api/spotify/auth';
import {
  getSpotifyTokenData,
  getUserBySpotifyUserID,
  addNewUser
} from '../api/server/server';


export const SET_LOGGED_IN_USER_REQUEST = 'SET_LOGGED_IN_USER_REQUEST';
export const SET_LOGGED_IN_USER_SUCCESS = 'SET_LOGGED_IN_USER_SUCCESS';

export const setLoggedInUserRequest = (userID) => {
  return {
    type: SET_LOGGED_IN_USER_REQUEST,
    payload: {
      userID
    }
  };
};


export const setLoggedInUserSuccess = (userID) => {
  return {
    type: SET_LOGGED_IN_USER_SUCCESS,
    payload: {
      userID
    }
  };
};

export const setLoggedInUser = (userID) => {
  return async (dispatch) => {
    dispatch(setLoggedInUserRequest(userID));
    await setUserID(userID);
    dispatch(setLoggedInUserSuccess(userID));
  }
};

export const GET_LOGGED_IN_USER_REQUEST = 'GET_LOGGED_IN_USER_REQEUST';
export const GET_LOGGED_IN_USER_ERROR = 'GET_LOGGED_IN_USER_ERROR';
export const GET_LOGGED_IN_USER_SUCCESS = 'GET_LOGGED_IN_USER_SUCCESS';

export const getLoggedInUserRequest = () => {
  return {
    type: GET_LOGGED_IN_USER_REQUEST,
    payload: {}
  };
};

export const getLoggedInUserError = () => {
  return {
    type: GET_LOGGED_IN_USER_ERROR,
    payload: {}
  };
};

export const getLoggedInUserSuccess = (userID, tokenData) => {
  return {
    type: GET_LOGGED_IN_USER_SUCCESS,
    payload: {
      userID,
      tokenData
    }
  };
};

export const getLoggedInUser = () => {
  return async (dispatch) => {
    dispatch(getLoggedInUserRequest());
    
    try {
      const userID = await getUserID();
      const tokenData = await getTokenData();
      dispatch(getLoggedInUserSuccess(userID, tokenData));
    }
    catch (error) {
      console.log('Error getting logged in user');
      dispatch (getLoggedInUserError());
    }
  };
}

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const COMPLETE_LOGIN_PROCESS = 'COMPLETE_LOGIN_PROCESS';

export const loginRequest = () => {
  return {
    type: LOGIN_REQUEST,
    payload: {}
  };
}

export const loginSuccess = (tokenData, userID) => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      tokenData,
      userID
    }
  };
}

export const completeLoginProcess = () => {
  return {
    type: COMPLETE_LOGIN_PROCESS
  }
};

export const login = () => {
  return async (dispatch) => {
    dispatch(loginRequest());
    const authCode = await getAuthorizationCode();
    const tokenData = await getSpotifyTokenData(authCode);
    await saveTokenData(
      tokenData.accessToken, 
      tokenData.expirationTime, 
      tokenData.refreshToken);

    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(tokenData.accessToken);
    const userData = await spotify.getMe();
    await setUserID(userData.id);
    dispatch(loginSuccess(tokenData, userData.id));

    const user = await getUserBySpotifyUserID(userData.id);
    console.log('got user:', user);
    if (!user.id) {
      await addNewUser(userData.id);
    }

  }
}

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const logoutRequest = () => {
  return {
    type: LOGOUT_REQUEST,
    payload: {}
  };
};

export const logoutError = () => {
  return {
    type: LOGOUT_ERROR,
    payload: {}
  };
};

export const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS,
    payload: {}
  };
};

export const fetchLogout = () => {
  return async (dispatch) => {
    dispatch (logoutRequest());

    try {
      await removeUserIDAndTokenData();
      dispatch (logoutSuccess());
    }
    catch (error) {
      dispatch (logoutError());
    }
  };
}