export const SET_USER_TOKEN_SUCCESS = 'SET_USER_TOKEN_SUCCESS';

export const setUserTokensSuccess = (accessToken, expirationTime, refreshToken) => {
  return {
    type: SET_USER_TOKEN_SUCCESS,
    payload: {
      accessToken,
      expirationTime,
      refreshToken
    }
  };
};