import { verifyTokenData } from '../api/spotify/util';
import * as playlistAPI from '../api/spotify/playlist';
import * as serverAPI from '../api/server/server';

import { setUserTokensSucces } from './tokenActions';
import token from '../api/spotify/token';

export const GROUP_CREATE_REQUEST = 'GROUP_CREATE_REQUEST';
export const GROUP_CREATE_SUCCESS = 'GROUP_CREATE_SUCCESS';
export const GROUP_CREATE_ERROR = 'GROUP_CREATE_ERROR';

export const groupCreateRequest = () => {
  return {
    type: GROUP_CREATE_REQUEST,
    payload: {}
  };
};

export const groupCreateSuccess = () => {
  return {
    type: GROUP_CREATE_SUCCESS,
    payload: {}
  };
};

export const groupCreateError = () => {
  return {
    type: GROUP_CREATE_ERROR,
    payload: {}
  };
};

export const fetchCreateGroup = (creatorID, creatorSpotifyID, memberSpotifyIDs, playlistName, tokenData) => {
  return async (dispatch) => {
    dispatch(groupCreateRequest());

    if (await verifyTokenData(tokenData)) {
      dispatch (setUserTokensSuccess(tokenData));
    }

    try {
      const playlistData = await playlistAPI.createPlaylist(creatorSpotifyID, playlistName, tokenData.accessToken);
      const playlistID = playlistData.id;
      const res = await serverAPI.createGroup(creatorID, memberSpotifyIDs, playlistID);

      dispatch(groupCreateSuccess());

      // refresh group data
      dispatch(fetchUserGetGroups(creatorID));
      
    }
    catch (error) {
      console.error(error);
      dispatch(groupCreateError());
    }
  };
};

export const USER_GET_GROUPS_REQUEST = 'USER_GET_GROUPS_REQUEST';
export const USER_GET_GROUPS_ERROR = 'USER_GET_GROUPS_ERROR';
export const USER_GET_GROUPS_SUCCESS = 'USER_GET_GROUPS_SUCCESS';

export const userGetGroupsRequest = () => {
  return {
    type: USER_GET_GROUPS_REQUEST,
    payload: {}
  };
};

export const userGetGroupsError = () => {
  return {
    type: USER_GET_GROUPS_ERROR,
    payload: {}
  };
};

export const userGetGroupsSuccess = (groups) => {
  return {
    type: USER_GET_GROUPS_SUCCESS,
    payload: {
      groups
    }
  };
};

export const fetchUserGetGroups = (userID, tokenData) => {
  return async (dispatch) => {
    dispatch (userGetGroupsRequest());

    if (await verifyTokenData(tokenData)) {
      dispatch (setUserTokensSuccess(tokenData));
    }

    try {
      const groups = await serverAPI.getGroupsForUser(userID);
      
      await Promise.all(groups.map(async group => {
        const playlistInfo = await playlistAPI.getPlaylist(group.playlistID, tokenData.accessToken);
        group.imageUrl = playlistInfo.images.length > 0 ? playlistInfo.images[0].url : "";
      }));

      console.log("GROPUS: ", groups);

      dispatch (userGetGroupsSuccess(groups));
    }
    catch (error) {
      dispatch (userGetGroupsError());
    }
  };
};