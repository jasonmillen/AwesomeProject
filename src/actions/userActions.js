import { 
  setUserID,
  saveUserData,
  getUserData
} from '../api/asyncStorage/asyncStorage';
import { getAuthorizationCode } from '../api/spotify/auth';
import SpotifyWebApi from 'spotify-web-api-js';

export const SET_LOGGED_IN_USER_REQUEST = 'SET_LOGGED_IN_USER_REQUEST';
export const SET_LOGGED_IN_USER_SUCCESS = 'SET_LOGGED_IN_USER_SUCCESS';

export const setLoggedInUserRequest = (userID) => {
  return {
    type: SET_LOGGED_IN_USER_REQUEST,
    payload: {
      userID
    }
  }
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
    dispatch(getLoggedInUserSuccess(null));
  }
}

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

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

export const login = () => {
  return async (dispatch) => {
    dispatch(loginRequest());
    const authCode = await getAuthorizationCode();
    const response = await fetch('http://192.168.1.7:3000/api/getSpotifyToken', {
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
    await saveUserData(
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