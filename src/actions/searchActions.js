import {
  verifyTokenData
} from '../api/spotify/util';

import {
  searchUser
} from '../api/spotify/util';

import {
  setUserTokensSuccess
} from './tokenActions';

export const SEARCH_USER_REQUEST = 'SEARCH_USER_REQUEST';
export const SEARCH_USER_SUCCESS = 'SEARCH_USER_SUCCESS';
export const SEARCH_USER_ERROR = 'SEARCH_USER_ERROR';

export const searchUserRequest = (userID) => {
  return {
    type: SEARCH_USER_REQUEST,
    payload: {
      userID
    }
  };
};

export const searchUserSuccess = (userData) => {
  return {
    type: SEARCH_USER_SUCCESS,
    payload: {
      userData
    }
  }
};

export const searchUserError = () => {
  return {
    type: SEARCH_USER_ERROR,
    payload: {}
  }
}

export const fetchSearchUser = (userID, tokenData) => {
  return async (dispatch) => {
    dispatch(searchUserRequest(userID));

    if (await verifyTokenData(tokenData)) {
      dispatch (setUserTokensSuccess(tokenData));
    }

    try {
      const userData = await searchUser(userID, tokenData.accessToken);
      dispatch(searchUserSuccess(userData));
    }
    catch (error) {
      console.log('error searching for user');

    }
  };
};