import { SPOTIFY_BASE_URL } from '../../../config';

import { getTokenData } from './token';

export const createPlaylist = async (spotifyUserID, playlistName, accessToken) => {
  console.log('IN ACTUAL CREATE PLAYLIST');
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
  //console.log('CREATE PLAYLIST RESPONSE', json);
  return json;
};

let count = 0;
export const getPlaylist = async (playlistID) => {

  // count++;
  // if (count >= 50) {
  //   console.error("=====================COUNT: ", count);
  // }

  const tokenData = await getTokenData();

  const uri = `${SPOTIFY_BASE_URL}/playlists/${playlistID}`;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenData.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const json = await res.json();
  return json;
};


export const checkIfUserFollowsPlaylist = async (playlistID, spotifyUserID) => {

  const tokenData = await getTokenData();

  const uri = `${SPOTIFY_BASE_URL}/playlists/${playlistID}/followers/contains?ids=${spotifyUserID}`;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenData.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const json = await res.json();
  //console.log('GET FOLLOWERS RESPONSE: ', json);
  return json[0];
};

// export const addSongToPlaylist = async (playlistID, trackID) => {

//   console.log(`adding track ${trackID} to playlist ${playlistID}`);

//   const tokenData = await getTokenData();

//   const uri = `${SPOTIFY_BASE_URL}/playlists/${playlistID}/tracks`;
//   const res = await fetch(uri, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${tokenData.accessToken}`,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       uris: [`spotify:track:${trackID}`]
//     })
//   });

//   const json = await res.json();
//   console.log("RESULT: ", json);
//   return json;
// };

export const followPlaylist = async (playlistID) => {
  const tokenData = await getTokenData();

  const uri = `${SPOTIFY_BASE_URL}/playlists/${playlistID}/followers`;
  const res = await fetch(uri, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${tokenData.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok || res.status !== 200) {
    throw new Error("Error following playlist: " + res.statusText);
  }

  return "OK";
}