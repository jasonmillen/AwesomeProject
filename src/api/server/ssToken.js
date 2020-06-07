import { IP } from '../../../config';
import * as asAPI from '../asyncStorage/asyncStorage';

// we keep this data here because it would be a pain to get it from the redux store
// if we got it from the redux store, the userID and tokenData would have to be passed with all actions

let _userID = null;

export const getUserID = async () => {
  if (!_userID) {
    _userID = await asAPI.getUserID();
  }

  return _userID;
};

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
    console.log('refreshing ssTokenData');
    const newSsTokenData = await refreshSsTokens(ssTokenData.ssRefreshToken);
    ssTokenData.ssAccessToken = newSsTokenData.ssAccessToken;
    ssTokenData.ssExpirationTime = newSsTokenData.ssExpirationTime;
    ssTokenData.ssRefreshToken = newSsTokenData.ssRefreshToken;
    return true;
  }
  return false;
};


// this would make more sense to put in /api/server/server.js, but this would result in cyclic dependency between server.js and ssToken.js
const refreshSsTokens = async (ssRefreshToken) => {
  const response = await fetch(`http://${IP}:3000/auth/refresh`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ssRefreshToken
    }),
  });

  const ssTokenData = await response.json();
  console.log("REFRESHED SSTOKENDATA: ", ssTokenData);
  return ssTokenData;
};

export const clearSsTokenData = () => {
  _ssTokenData = {
    ssAccessToken: null,
    ssExpirationTime: null,
    ssRefreshToken: null
  };
};