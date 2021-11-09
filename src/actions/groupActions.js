//import Toast from 'react-native-simple-toast';

import { verifyTokenData } from '../api/spotify/token';
import * as userAPI from '../api/spotify/user';
import * as playlistAPI from '../api/spotify/playlist';
import * as trackAPI from '../api/spotify/track';
import * as serverAPI from '../api/server/server';

import { setUserTokensSuccess } from './tokenActions';
//import token from '../api/spotify/token';

import * as sockAPI from './socketActions';

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

    try {
      if (await verifyTokenData(tokenData)) {
        dispatch (setUserTokensSuccess(tokenData));
      }
      const playlistData = await playlistAPI.createPlaylist(creatorSpotifyID, playlistName, tokenData.accessToken);
      const playlistID = playlistData.id;
      const group = await serverAPI.createGroup(creatorID, memberSpotifyIDs, playlistID);
      sockAPI.createGroup(group);

      dispatch(groupCreateSuccess());

      // refresh group data
      dispatch(exports.fetchUserGetGroups(creatorID, creatorSpotifyID));
      
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

export const userGetGroupsSuccess = (groups, groupFollowStatusByID) => {
  return {
    type: USER_GET_GROUPS_SUCCESS,
    payload: {
      groups,
      groupFollowStatusByID
    }
  };
};

export const USER_GET_USERS_SUCCESS = 'USER_GET_USERS_SUCCESS';
export const userGetUsersSuccess = (users, usersByGroupID) => {
  return {
    type: USER_GET_USERS_SUCCESS,
    payload: {
      users,
      usersByGroupID
    }
  };
};

export const fetchUserGetGroups = (userID, spotifyUserID) => {
  console.log("fetchUserGetGroups");
  return async (dispatch) => {
    dispatch (userGetGroupsRequest());
    
    try {
      const groupsData = await serverAPI.getGroupsForUser(userID);
      const groups = groupsData.groups;
      const groupFollowStatusByID = {};
      
      await Promise.all(groups.map(async group => {
        const playlistInfo = await playlistAPI.getPlaylist(group.playlistID);
        group.imageUrl = (playlistInfo && playlistInfo.images && playlistInfo.images.length > 0 ) ? playlistInfo.images[0].url : "";
        group.playlistName = playlistInfo.name;

        if (playlistInfo.owner.id  === spotifyUserID) {
          groupFollowStatusByID[group.id] = true;
        }
        else {
          const isFollowing = await playlistAPI.checkIfUserFollowsPlaylist(group.playlistID, spotifyUserID);
          groupFollowStatusByID[group.id] = isFollowing;
        }
      }));

      // console.log('GROUP FOLLOW STATUS BY ID: ', groupFollowStatusByID);
      dispatch (userGetGroupsSuccess(groups, groupFollowStatusByID));

      const users = groupsData.users;

      await Promise.all(users.map(async user => {
        const userInfo = await userAPI.searchUser(user.spotifyUserID);
        if (userInfo) {
          user.displayName = userInfo.display_name;
          user.imageUrl = userInfo.images.length ? userInfo.images[0].url : null
        }
        else {
          console.error('Error getting user info for user: ', user);
        }
      }));
      const usersByGroupID = groupsData.usersByGroupID;
      dispatch (userGetUsersSuccess(users, usersByGroupID));
    }
    catch (error) {
      console.log('Error getting users groups: ');
      console.log(error);
      if (error.Error) {
        console.log('Additional error info: ');
        console.log(error.Error);
      }
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

export const groupAddSongSuccess = (message) => {
  return {
    type: GROUP_ADD_SONG_SUCCESS,
    payload: {
      message
    }
  };
};

export const fetchGroupAddSong = (groupID, playlistID, trackID, senderID) => {
  return async (dispatch) => {
    dispatch(groupAddSongRequest());

    try {
      //await playlistAPI.addSongToPlaylist(playlistID, trackID);
      const message = await serverAPI.groupAddSong(groupID, trackID, senderID);
      console.log('MESSAGE: ', message);
      sockAPI.groupAddSong(message);
      message.trackInfo = await trackAPI.getTrack(message.trackID);

      dispatch(groupAddSongSuccess(message));
      //if (Toast) { Toast.showWithGravity('Song Added!', Toast.SHORT, Toast.CENTER); }
    }
    catch (error) {
      console.error(error);
      dispatch(groupAddSongError());
    }
  }
}


export const GROUP_SEND_TEXT_MESSAGE_REQUEST = 'GROUP_SEND_TEXT_MESSAGE_REQUEST';
export const GROUP_SEND_TEXT_MESSAGE_ERROR = 'GROUP_SEND_TEXT_MESSAGE_ERROR';
export const GROUP_SEND_TEXT_MESSAGE_SUCCESS = 'GROUP_SEND_TEXT_MESSAGE_SUCCESS';

export const groupSendTextMessageRequest = () => {
  return {
    type: GROUP_SEND_TEXT_MESSAGE_REQUEST,
    payload: {}
  };
};

export const groupSendTextMessageError = () => {
  return {
    type: GROUP_SEND_TEXT_MESSAGE_ERROR,
    payload: {}
  };
};

export const groupSendTextMessageSuccess = (message) => {
  return {
    type: GROUP_SEND_TEXT_MESSAGE_SUCCESS,
    payload: {
      message
    }
  };
};

export const fetchGroupSendTextMessage = (groupID, text, senderID) => {
  return async (dispatch) => {
    dispatch(groupSendTextMessageRequest());

    try {
      console.log("in new action", groupID, text, senderID)
      const message = await serverAPI.groupAddTextMessage(groupID, text, senderID);
      console.log('MESSAGE: ', message);
      sockAPI.groupSendTextMessage(message);
      dispatch(groupSendTextMessageSuccess(message));
    }
    catch (error) {
      console.error(error);
      dispatch(groupSendTextMessageError());
    }
  }
}


export const GROUP_SELECT = 'GROUP_SELECT';
export const groupSelect = (groupID) => {
  return {
    type: GROUP_SELECT,
    payload: {
      groupID
    }
  };
};


export const GROUP_FOLLOW_PLAYLIST_REQUEST = 'GROUP_FOLLOW_PLAYLST_REQUEST';
export const GROUP_FOLLOW_PLAYLIST_ERROR = 'GROUP_FOLLOW_PLAYLST_ERROR';
export const GROUP_FOLLOW_PLAYLIST_SUCCESS = 'GROUP_FOLLOW_PLAYLST_SUCCESS';

export const groupFollowPlaylistRequest = () => {
  return {
    type: GROUP_FOLLOW_PLAYLIST_REQUEST,
    payload: {}
  };
};

export const groupFollowPlaylistError = () => {
  return {
    type: GROUP_FOLLOW_PLAYLIST_ERROR,
    payload: {}
  };
};

export const groupFollowPlaylistSuccess = (groupID) => {
  return {
    type: GROUP_FOLLOW_PLAYLIST_SUCCESS,
    payload: {
      groupID
    }
  };
};

export const groupFollowPlaylist = (group) => {
  return async (dispatch) => {
    
    dispatch(groupFollowPlaylistRequest());
    
    try {
      const response = await playlistAPI.followPlaylist(group.playlistID);
      dispatch(groupFollowPlaylistSuccess(group.id));
    }
    catch (error) {
      console.error(error);
      dispatch(groupFollowPlaylistError());
    }


  }
}

