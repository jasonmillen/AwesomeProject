import * as asAPI from '../asyncStorage/asyncStorage';

let _ssTokenData = {
  ssAccessToken: null,
  ssExpirationTime: null,
  ssRefreshToken: null
};

export const getSsTokenData = async () => {
  if (!_ssTokenData.ssAccessToken || !_ssTokenData.ssExpirationTime || !_ssTokenData.ssRefreshToken) {
    _ssTokenData = await asAPI.getSsTokenData();
  }

  console.log(2);
  if (await verifySsTokenData(_ssTokenData)) {
    await asAPI.saveSsTokenData(_ssTokenData.ssAccessToken, _ssTokenData.ssExpirationTime, _ssTokenData.ssRefreshToken);
  }

  console.log(3);
  return _ssTokenData;
};

// returns true if token data was updated
const verifySsTokenData = async (ssTokenData) => {
  if (ssTokenData && ssTokenData.ssExpirationTime < new Date().getTime()) {
    const newSsTokenData = await refreshSsTokens(ssTokenData.ssRefreshToken);
    ssTokenData.ssAccessToken = newSsTokenData.ssAccessToken;
    ssTokenData.ssAccessToken = newSsTokenData.ssExpirationTime;
    ssTokenData.ssAccessToken = newSsTokenData.ssRefreshToken;
    return true;
  }
  return false;
};


// this would make more sense to put in /api/server/server.js, but this would result in cyclic dependency between server.js and ssToken.js
const refreshSsTokens = async (ssRefreshToken) => {
  // TODO: implement me
  return {
    ssAccessToken: null,
    ssExpirationTime: null,
    ssRefreshToken: null
  }
};

export const clearSsTokenData = () => {
  _ssTokenData = {
    ssAccessToken: null,
    ssExpirationTime: null,
    ssRefreshToken: null
  };
};