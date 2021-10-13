import {
  searchUser
} from '../api/spotify/user';

export const SEARCH_USER_REQUEST = 'SEARCH_USER_REQUEST';
export const SEARCH_USER_SUCCESS = 'SEARCH_USER_SUCCESS';
export const SEARCH_USER_ERROR = 'SEARCH_USER_ERROR';

export const searchUserRequest = (spotifyUserID) => {
  return {
    type: SEARCH_USER_REQUEST,
    payload: {
      spotifyUserID
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

export const fetchSearchUser = (spotifyUserID) => {
  return async (dispatch) => {
    dispatch(searchUserRequest(spotifyUserID));

    try {
      const userData = await searchUser(spotifyUserID);
      dispatch(searchUserSuccess(userData));
    }
    catch (error) {
      console.log('error searching for user');

    }
  };
};

export const SEARCH_CLEAR_RESULTS = 'SEARCH_CLEAR_RESULTS';
export const searchClearResults = () => {
  return {
    type: SEARCH_CLEAR_RESULTS,
    payload: {}
  };
};