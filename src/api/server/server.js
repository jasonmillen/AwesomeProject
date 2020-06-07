import {
  IP
} from '../../../config';

import { getUserID, getSsTokenData } from './ssToken';


export const getSpotifyTokenData = async (authCode) => {
  const response = await fetch(`http://${IP}:3000/api/getSpotifyToken`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      authCode: authCode.params.code
    }),
  });
  const res = await response.json();
  console.log('GET SPOTIFY TOKEN DATA RES: ', res);
  const tokenData = res.tokenData;
  const ssTokenData = res.ssTokenData;
  return { 
    tokenData, 
    ssTokenData 
  };
};

export const refreshTokens = async (refreshToken) => {

  const userID = await getUserID();
  const ssTokenData = await getSsTokenData();

  const response = await fetch(`http://${IP}:3000/api/refreshSpotifyToken`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ssTokenData.ssAccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'UserID': userID
    },
    body: JSON.stringify({
      refreshToken
    }),
  });
  const tokenData = await response.json();
  return tokenData;
};

export const getUserBySpotifyUserID = async (spotifyUserID) => {

  console.log('BEFORE');
  const ssTokenData = await getSsTokenData();


  console.log('AFTER')
  let response = await fetch(`http://${IP}:3000/api/user/${spotifyUserID}/spotify`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ssTokenData.ssAccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  });
  const res = await response.json();
  console.log('got user', res);
  if (res.status === 404) {
    return null;
  }

  return res;
};

// TODO: DEPRECATE
export const addNewUser = async (spotifyUserID) => {

  const ssTokenData = await getSsTokenData();

  let response = await fetch(`http://${IP}:3000/api/user/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ssTokenData.ssAccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spotifyUserID
    })
  });
  response = await response.json();
  console.log(response);
  return response;
};

export const createGroup = async (creatorID, memberSpotifyIDs, playlistID) => {

  const ssTokenData = await getSsTokenData();

  let response = await fetch(`http://${IP}:3000/api/group/create`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ssTokenData.ssAccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'UserID': creatorID
    },
    body: JSON.stringify({
      creatorID,
      memberSpotifyIDs,
      playlistID
    })
  });
  group = await response.json();
  console.log('CREATE GROUP res: ', group);
  return group;
};

export const getGroupsForUser = async (userID) => {

  const ssTokenData = await getSsTokenData();

  let response = await fetch(`http://${IP}:3000/api/user/${userID}/groups`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ssTokenData.ssAccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'UserID': userID
    }
  });

  response = await response.json();
  return response;
};

export const groupAddSong = async (groupID, trackID, senderID) => {

  const ssTokenData = await getSsTokenData();

  let response = await fetch(`http://${IP}:3000/api/group/track`, {
    method: 'POST',
    headers: {
      Bearer: `Bearer ${ssTokenData.ssAccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'UserID': senderID
    },
    body: JSON.stringify({
      groupID,
      trackID,
      senderID
    })
  });
  

  response = await response.json();
  console.log('created message: ', response);

  return response;
};

export const groupGetMessages = async (groupID) => {

  const userID = await getUserID();
  const ssTokenData = await getSsTokenData();

  let response = await fetch(`http://${IP}:3000/api/group/${groupID}/messages`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ssTokenData.ssAccessToken}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'UserID': userID
    }
  });

  response = await response.json();
  //console.log('got messages: ', response);

  return response;
};
