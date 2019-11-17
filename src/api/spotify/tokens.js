import { encode as btoa } from 'base-64';

import { getAuthorizationCode } from './auth';
import getSpotifyCredentials from './credentials';

export const getTokens = async () => {
  let tokenData;
  try {
    const authorizationCode = await getAuthorizationCode();
    console.log("authorization code");
    console.log(authorizationCode);
    const credentials = getSpotifyCredentials();
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);

    console.log('before fetch');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${authorizationCode.params.code}&redirect_uri=${
        credentials.redirectUri
      }`,
    });

    console.log('after fetch');
    console.log(response);

    const responseJson = await response.json();
    // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn
    } = responseJson;

    const expirationTime = new Date().getTime() + expiresIn * 1000;
    // set user data accessToken
    // set user data refreshToken
    // set user data expirationTime
    tokenData = {
      accessToken,
      refreshToken,
      expirationTime
    };
  }
  catch (err) {
    console.error(err);
  }

  return tokenData;
};

export const refreshTokens = async (refreshToken) => {
  let tokenData;
  try {
    const credentials = await getSpotifyCredentials();
    const credsB64 = btoa(`${credentials.clientId}:${credentials.clientSecret}`);
    //const refreshToken = await getUserData('refreshToken');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      await getTokens();
    } 
    else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      //await setUserData('accessToken', newAccessToken);
      tokenData.accessToken = newAccessToken;
      if (newRefreshToken) {
        //await setUserData('refreshToken', newRefreshToken);
        tokenData.refreshToken = newRefreshToken;
      }
      //await setUserData('expirationTime', expirationTime);
      tokenData.expirationTime = expirationTime;
    } 
  }
  catch (err) {
    console.error(err)
  }
};