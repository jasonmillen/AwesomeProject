export const SET_LOGGED_IN_USER_SUCCESS = 'SET_LOGGED_IN_USER_SUCCESS';

export const setLoggedInUserSuccess = (userID) => {
  return {
    type: SET_LOGGED_IN_USER,
    payload: {
      userID
    }
  };
};