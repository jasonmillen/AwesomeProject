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