import { SPOTIFY_BASE_URL } from '../../../config';

export const createPlaylist = async (spotifyUserID, playlistName, accessToken) => {
  const uri = `${SPOTIFY_BASE_URL}/users/${spotifyUserID}/playlists`;
  const res = await fetch(uri, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: playlistName,
      public: false,
      collaborative: true
    })
  });
  const json = await res.json();
  console.log('CREATE PLAYLIST RESPONSE', json);
  return json;
};

export const getPlaylist = async (playlistID, accessToken) => {

  const uri = `${SPOTIFY_BASE_URL}/playlists/${playlistID}`;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const json = await res.json();
  return json;
};