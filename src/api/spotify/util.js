import SpotifyWebApi from 'spotify-web-api-js';
const spotify = new SpotifyWebApi();

import { SPOTIFY_BASE_URL } from '../../../config';

export const searchUser = async (userID, accessToken) => {
  const uri = `${SPOTIFY_BASE_URL}/users/${userID}`;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });
  const json = await res.json();

  if (json.error && json.error.status === 404) {
    console.log('User not found');
    return null;
  }
  else if (json.id && json.id.length > 0) {
    console.log('User found: ', json.id);
    return json;
  }
  
};

// returns true if token data was updated
export const verifyTokenData = async (tokenData) => {
  if (tokenData.expirationTime < new Date().getTime()) {
    const newTokenData = await refreshTokens(tokenData.refreshToken);
    tokenData.accessToken = newTokenData.accessToken;
    tokenData.expirationTime = newTokenData.expirationTime;
    tokenData.refreshToken = newTokenData.refreshToken;
    return true;
  }
  return false;
};