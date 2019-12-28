import SpotifyWebApi from 'spotify-web-api-js';
import {
  IP
} from '../../config';
import { 
  setUserID,
  getUserID,
  saveTokenData,
  getTokenData
} from '../api/asyncStorage/asyncStorage';
import { getAuthorizationCode } from '../api/spotify/auth';


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
export const GET_LOGGED_IN_USER_SUCCESS = 'GET_LOGGED_IN_USER_SUCCESS';

export const getLoggedInUserRequest = () => {
  return {
    type: GET_LOGGED_IN_USER_REQUEST,
    payload: {}
  }
};

export const getLoggedInUserSuccess = (userID) => {
  return {
    type: GET_LOGGED_IN_USER_SUCCESS,
    payload: {
      userID
    }
  }
};

export const getLoggedInUser = () => {
  return async (dispatch) => {
    dispatch(getLoggedInUserRequest());
    // TODO: add async storage call to actuallly get user
    const userID = await getUserID();
    dispatch(getLoggedInUserSuccess(userID));
  }
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
    const response = await fetch(`http://${IP}:3000/api/getSpotifyToken`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authCode: authCode.params.code
      }),
    });
    const tokenData = await response.json();
    await saveTokenData(
      tokenData.accessToken, 
      tokenData.expirationTime, 
      tokenData.refreshToken);

    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(tokenData.accessToken);
    const userData = await spotify.getMe();
    await setUserID(userData.id);
    dispatch(loginSuccess(tokenData, userData.id));
  }
}