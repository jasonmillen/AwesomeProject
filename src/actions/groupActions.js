import Toast from 'react-native-simple-toast';

import { verifyTokenData } from '../api/spotify/util';
import * as playlistAPI from '../api/spotify/playlist';
import * as serverAPI from '../api/server/server';

import { setUserTokensSuccess } from './tokenActions';
//import token from '../api/spotify/token';

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
  console.log("fetchUserGetGroups");
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
        group.playlistName = playlistInfo.name;
      }));

      dispatch (userGetGroupsSuccess(groups));
    }
    catch (error) {
      console.log(error);
      dispatch (userGetGroupsError());
    }
  };
};

export const GROUP_ADD_SONG_REQUEST = 'GROUP_ADD_SONG_REQUEST';
export const GROUP_ADD_SONG_ERROR = 'GROUP_ADD_SONG_ERROR';
export const GROUP_ADD_SONG_SUCCESS = 'GROUP_ADD_SONG_SUCCESS';

export const groupAddSongRequest = () => {
  return {
    type: GROUP_ADD_SONG_REQUEST,
    payload: {}
  };
};

export const groupAddSongError = () => {
  return {
    type: GROUP_ADD_SONG_ERROR,
    payload: {}
  };
};

export const groupAddSongSuccess = () => {
  return {
    type: GROUP_ADD_SONG_SUCCESS,
    payload: {}
  };
};

export const fetchGroupAddSong = (groupID, playlistID, trackID, senderID) => {
  return async (dispatch) => {
    dispatch(groupAddSongRequest());

    try {
      await playlistAPI.addSongToPlaylist(playlistID, trackID);
      const message = await serverAPI.groupAddSong(groupID, trackID, senderID);

      dispatch(groupAddSongSuccess());
      Toast.showWithGravity('Song Added!', Toast.SHORT, Toast.CENTER);
    }
    catch (error) {
      console.error(error);
      dispatch(groupAddSongError());
    }
  }
}


// export const GROUP_SELECT_REQUEST = 'GROUP_SELECT_REQUEST';
// export const GROUP_SELECT_ERROR = 'GROUP_SELECT_ERROR';
// export const GROUP_SELECT_SUCCESS = 'GROUP_SELECT_SUCCESS';

// export const groupSelectRequest = () => {
//   return {
//     type: GROUP_CREATE_REQUEST,
//     payload: {}
//   };
// };

// export const groupSelectError = () => {
//   return {
//     type: GROUP_SELECT_ERROR,
//     payload: {}
//   };
// };

// export const groupSelectSuccess = (groupID) => {
//   return {
//     type: GROUP_SELECT_SUCCESS,
//     payload: {}
//   };
// };

export const GROUP_SELECT = 'GROUP_SELECT';
export const groupSelect = (groupID) => {
  return {
    type: GROUP_SELECT,
    payload: {
      groupID
    }
  };
};


