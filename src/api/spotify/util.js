import { refreshTokens } from './tokens';

export const validateSpotifyObj = (spotifyObj, expirationTime, refreshToken) => {
  if (expirationTime < new Date().getTime()) {
    const tokenData = await refreshTokens(refreshToken);
  }
  spotifyObj.setAccessToken(tokenData.accessToken);
};