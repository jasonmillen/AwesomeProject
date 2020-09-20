import { SPOTIFY_BASE_URL } from '../../../config';

import { getTokenData } from './token';

export const getTrack = async(trackID) => {

  const tokenData = await getTokenData();

  const uri = `${SPOTIFY_BASE_URL}/tracks/${trackID}`;
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

export const getRecentlyPlayedTracks = async() => {

  const tokenData = await getTokenData();

  const uri = `${SPOTIFY_BASE_URL}/me/player/recently-played`;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${tokenData.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const json = await res.json();
  return json.items;
};

export const getTopTracks = async() => {

  const tokenData = await getTokenData();

  const uri = `${SPOTIFY_BASE_URL}/me/top/tracks`;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${tokenData.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const json = await res.json();
  console.log('TOP TRACKS: ', json);
  return json.items;
};

export const getTop50ViralGlobalTracks = async() => {

  const viral50PlaylistID = '37i9dQZEVXbLiRSasKsNU9';

  const tokenData = await getTokenData();

  const uri = `${SPOTIFY_BASE_URL}/playlists/${viral50PlaylistID}/tracks?limit=20`;
  const res = await fetch(uri, {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      Authorization: `Bearer ${tokenData.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  const json = await res.json();
  return json.items;
};

export const normalizeTrack = (track) => {
  return {
    id: track.id,
    title: track.name,
    artist: track.artists.length > 0 && track.artists[0].name ? track.artists[0].name : '',
    album: track.album.name || '',
    imageUri: track.album.images
      ? track.album.images[0].url
      : undefined
  };
}