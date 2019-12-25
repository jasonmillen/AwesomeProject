import {
  refreshTokens
} from '../api/spotify/token';

export const SET_USER_TOKEN_SUCCESS = 'SET_USER_TOKEN_SUCCESS';

export const verifyTokenData = async (dispatch, tokenData) => {
  if (tokenData.expirationTime < new Date().getTime()) {
    const newTokenData = await refreshTokens(tokenData.refreshToken);
    dispatch(setUserTokensSuccess(
      newTokenData.refreshTokens,
      newTokenData.expirationTime,
      newTokenData.refreshToken
    ));
    tokenData.accessToken = newTokenData.accessToken;
    tokenData.expirationTime = newTokenData.expirationTime;
    tokenData.refreshToken = newTokenData.refreshToken;
  }
};

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