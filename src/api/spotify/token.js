// import {
//   IP
// } from '../../../config';

import * as asAPI from '../asyncStorage/asyncStorage';

import { refreshTokens } from '../server/server';

let _tokenData = {
  accessToken: null,
  expirationTime: null,
  refreshToken: null
};

export const getTokenData = async () => {
  if (!_tokenData.accessToken || !_tokenData.expirationTime || !_tokenData.refreshToken) {
    _tokenData = await asAPI.getTokenData();
  }

  if (await verifyTokenData(_tokenData)) {
    await asAPI.saveTokenData(_tokenData.accessToken, _tokenData.expirationTime, _tokenData.refreshToken);
  }

  return _tokenData;
};

// returns true if token data was updated
export const verifyTokenData = async (tokenData) => {
  if (tokenData && tokenData.expirationTime < new Date().getTime()) {
    const newTokenData = await refreshTokens(tokenData.refreshToken);
    tokenData.accessToken = newTokenData.accessToken;
    tokenData.expirationTime = newTokenData.expirationTime;
    tokenData.refreshToken = newTokenData.refreshToken;
    return true;
  }
  return false;
};

export const clearTokenData = () => {
  _tokenData = {
    accessToken: null,
    expirationTime: null,
    refreshToken: null
  };
};