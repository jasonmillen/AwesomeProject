import {
  refreshTokens
} from '../api/spotify/token';

export const SET_USER_TOKEN_SUCCESS = 'SET_USER_TOKEN_SUCCESS';

export const setUserTokensSuccess = (tokenData) => {
  const { accessToken, expirationTime, refreshToken } = tokenData;
  return {
    type: SET_USER_TOKEN_SUCCESS,
    payload: {
      accessToken,
      expirationTime,
      refreshToken
    }
  };
};