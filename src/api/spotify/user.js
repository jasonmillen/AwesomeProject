import { SPOTIFY_BASE_URL } from '../../../config';

import { getTokenData } from './token';

export const searchUser = async (spotifyUserID) => {

  const tokenData = await getTokenData();

  const uri = `${SPOTIFY_BASE_URL}/users/${spotifyUserID}`;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenData.accessToken}`,
    }
  });
  const json = await res.json();

  if (json.error && json.error.status === 404) {
    console.log('User not found');
    return null;
  }
  else if (json.id && json.id.length > 0) {
    //console.log('User found: ', json.id);
    return json;
  }
  else {
    console.log('ERROR getting user.  Received following data from server: ' + json);
    return null;
  }
};

export const getUserPlaylists = async () => {

  const tokenData = await getTokenData();

  let playlists = [];
  let uri = `${SPOTIFY_BASE_URL}/me/playlists?offset=0&limit=20`;
  while (true) {
    // may need to add a rate limiter in here to avoid getting rate limited 
    // by the spotify api if we spam the api
    const res = await fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenData.accessToken}`,
      }
    });
    const json = await res.json();

    if (json.error) {
      console.log(`Error getting user playlists: `, json.error);
      return playlists;
    }
    else if (json.items) {
      playlists = playlists.concat(json.items);
      if (!json.next) {
        return playlists;
      }

      uri = json.next;
    }
    else {
      console.log('ERROR getting user playlists.  Received following data from server: ', json);
      return playlists;
    }
  }

};