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
    console.log('User found: ', json.id);
    return json;
  }
  else {
    console.log('ERROR getting user.  Received following data from server: ' + json);
    return null;
  }
};