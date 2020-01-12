import {
  IP
} from '../../../config';

export const getUserBySpotifyUserID = async (spotifyUserID) => {
  const response = await fetch(`http://${IP}:3000/api/getUserBySpotifyUserID`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spotifyUserID
    }),
  });
  const user = await response.json();
  console.log('got user', user);
  return user;
};