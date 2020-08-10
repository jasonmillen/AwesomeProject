import * as AuthSession from 'expo-auth-session';

import getSpotifyCredentials from './credentials';

const scopesArr = ['user-modify-playback-state','user-read-currently-playing','user-read-playback-state','user-library-modify',
                   'user-library-read','playlist-read-private','playlist-read-collaborative','playlist-modify-public',
                   'playlist-modify-private','user-read-recently-played','user-top-read'];


scopes = scopesArr.join(' ');

export const getAuthorizationCode = async () => {
  let result;
  try {
    const credentials = getSpotifyCredentials();
    AuthSession.mak
    const redirectUrl = AuthSession.getRedirectUrl();
    result = await AuthSession.startAsync({
      authUrl:
        'https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' +
        credentials.clientId +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' +
        encodeURIComponent(redirectUrl)
    });
  }
  catch (err) {
    console.log(err);
  }
  return result
};