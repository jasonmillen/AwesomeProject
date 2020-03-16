import SpotifyWebApi from 'spotify-web-api-js';
import {
  IP
} from '../../config';
import * as asAPI from '../api/asyncStorage/asyncStorage';
import { getAuthorizationCode } from '../api/spotify/auth';
import * as serverAPI from '../api/server/server';


export const SET_LOGGED_IN_USER_REQUEST = 'SET_LOGGED_IN_USER_REQUEST';
export const SET_LOGGED_IN_USER_SUCCESS = 'SET_LOGGED_IN_USER_SUCCESS';

export const setLoggedInUserRequest = (spotifyUserID) => {
  return {
    type: SET_LOGGED_IN_USER_REQUEST,
    payload: {
      spotifyUserID
    }
  };
};


export const setLoggedInUserSuccess = (spotifyUserID) => {
  return {
    type: SET_LOGGED_IN_USER_SUCCESS,
    payload: {
      spotifyUserID
    }
  };
};

export const setLoggedInUser = (spotifyUserID) => {
  return async (dispatch) => {
    dispatch(setLoggedInUserRequest(spotifyUserID));
    //await setUserID(userID);
    await asAPI.setSpotifyUserID(spotifyUserID);
    dispatch(setLoggedInUserSuccess(spotifyUserID));
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

export const getLoggedInUserSuccess = (userID, spotifyUserID, tokenData) => {
  return {
    type: GET_LOGGED_IN_USER_SUCCESS,
    payload: {
      userID,
      spotifyUserID,
      tokenData
    }
  };
};

export const getLoggedInUser = () => {
  return async (dispatch) => {
    dispatch(getLoggedInUserRequest());
    
    try {
      //await asAPI.clear();

      const spotifyUserID = await asAPI.getSpotifyUserID();
      const tokenData = await asAPI.getTokenData();
      let user = await serverAPI.getUserBySpotifyUserID(spotifyUserID);
      dispatch(getLoggedInUserSuccess(user.id, spotifyUserID, tokenData));
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

export const loginSuccess = (tokenData, userID, spotifyUserID) => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      tokenData,
      userID,
      spotifyUserID
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
    console.log("authCode: ", authCode);

    const tokenData = await serverAPI.getSpotifyTokenData(authCode);
    console.log("token data: ", tokenData);
  
    await asAPI.saveTokenData(
      tokenData.accessToken, 
      tokenData.expirationTime, 
      tokenData.refreshToken);

    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(tokenData.accessToken);
    const spotifyUserData = await spotify.getMe();
    //await setUserID(userData.id);
    await asAPI.setSpotifyUserID(spotifyUserData.id);

    let user = await serverAPI.getUserBySpotifyUserID(spotifyUserData.id);
    if (!user || !user.id) {
      user = await serverAPI.addNewUser(spotifyUserData.id);
    }
    dispatch(loginSuccess(tokenData, user.id, spotifyUserData.id));
  };
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
      await asAPI.removeSpotifyUserIDAndTokenData();
      dispatch (logoutSuccess());
    }
    catch (error) {
      dispatch (logoutError());
    }
  };
};
