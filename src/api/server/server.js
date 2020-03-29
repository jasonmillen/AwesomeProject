import {
  IP
} from '../../../config';

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
  const tokenData = await response.json();
  return tokenData;
};

export const refreshTokens = async (refreshToken) => {
  const response = await fetch(`http://${IP}:3000/api/refreshSpotifyToken`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refreshToken
    }),
  });
  const tokenData = await response.json();
  return tokenData;
};

export const getUserBySpotifyUserID = async (spotifyUserID) => {
  const response = await fetch(`http://${IP}:3000/api/user/${spotifyUserID}/spotify`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  });
  const user = await response.json();
  console.log('got user', user);
  return user;
};

export const addNewUser = async (spotifyUserID) => {
  let response = await fetch(`http://${IP}:3000/api/user/create`, {
    method: 'POST',
    headers: {
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
  let response = await fetch(`http://${IP}:3000/api/group/create`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      creatorID,
      memberSpotifyIDs,
      playlistID
    })
  });
  response = await response.json();
  console.log('CREATE GROUP res: ', response);
};

export const getGroupsForUser = async (userID) => {
  let response = await fetch(`http://${IP}:3000/api/user/${userID}/groups`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  });

  response = await response.json();
  console.log('got groups from server', response);
  return response;
};

export const groupAddSong = async (groupID, trackID, senderID) => {

  let response = await fetch(`http://${IP}:3000/api/group/track`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
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

  let response = await fetch(`http://${IP}:3000/api/group/${groupID}/messages`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

  response = await response.json();
  //console.log('got messages: ', response);

  return response;
};
