import SpotifyWebApi from 'spotify-web-api-js';
const spotify = new SpotifyWebApi();

export const getContacts = async (userID, accessToken) => {
  spotify.setAccessToken(accessToken);
  //spotify.get

};