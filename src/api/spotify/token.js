// import {
//   IP
// } from '../../../config';

import * as asAPI from '../asyncStorage/asyncStorage';
import { verifyTokenData } from './util';

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


/*const apiPrefix = 'https://accounts.spotify.com/api';
const base64credentials = 'OGNmNTM4MGY1ODhjNGVhMTg4NDk2ZTI1NGVkNjM3NjA6MjZjZjkxMTg2ZDdlNDBhMWI1ZmVlY2Y0NDlmNzk4MWI=';

export default async () => {
  console.log('token begin');
  const res = await fetch(`${apiPrefix}/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const json = await res.json();
  const newToken = json.access_token;
  console.log('token is', newToken);
  return newToken;
};*/

// export const refreshTokens = async (refreshToken) => {
//   const response = await fetch(`http://${IP}:3000/api/refreshSpotifyToken`, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       refreshToken
//     }),
//   });
//   const tokenData = await response.json();
//   return tokenData;
// };