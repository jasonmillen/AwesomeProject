import {
  GROUP_CREATE_REQUEST,
  GROUP_CREATE_ERROR,
  GROUP_CREATE_SUCCESS,
  USER_GET_GROUPS_REQUEST,
  USER_GET_GROUPS_ERROR,
  USER_GET_GROUPS_SUCCESS,
  GROUP_ADD_SONG_REQUEST,
  GROUP_ADD_SONG_ERROR,
  GROUP_ADD_SONG_SUCCESS,
  GROUP_SELECT,
  GROUP_FOLLOW_PLAYLIST_REQUEST,
  GROUP_FOLLOW_PLAYLIST_ERROR,
  GROUP_FOLLOW_PLAYLIST_SUCCESS
} from '../actions/groupActions';

import {
  LOGOUT_SUCCESS
} from '../actions/userActions';

import { 
  SOCKET_RECEIVE_GROUP, 
  SOCKET_RECEIVE_SEARCH_SONG_START, 
  SOCKET_RECEIVE_SEARCH_SONG_STOP 
} from '../actions/socketActions';

const initialState = {
  userGetGroupsSuccess: null,
  userGetGroupsError: null,
  groupsByID: {},
  groupFollowStatusByID: {},
  usersSearchingForSongsByGroupID: {},
  selectedGroupID: null
};

export default groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_SUCCESS: {
      return initialState;
    }
    case GROUP_CREATE_REQUEST: {
      console.log(GROUP_CREATE_REQUEST);
      return state;
    }
    case GROUP_CREATE_ERROR: {
      console.log(GROUP_CREATE_ERROR);
      return state;
    }
    case GROUP_CREATE_SUCCESS: {
      console.log(GROUP_CREATE_SUCCESS);
      return state;
    }
    case USER_GET_GROUPS_REQUEST: {
      console.log(USER_GET_GROUPS_REQUEST);
      return {
        ...state,
        userGetGroupsError: false
      };
    }
    case USER_GET_GROUPS_ERROR: {
      console.log(USER_GET_GROUPS_ERROR);
      return {
        ...state,
        userGetGroupsError: true
      };
    }
    case USER_GET_GROUPS_SUCCESS: {
      console.log(USER_GET_GROUPS_SUCCESS);
      const groupsByID = action.payload.groups.reduce((groupsByID, group) => {
        groupsByID[group.id] = group;
        return groupsByID;
      }, {});
      return {
        ...state,
        userGetGroupsSuccess: true,
        groupsByID,
        groupFollowStatusByID: action.payload.groupFollowStatusByID
      };
    }
    case GROUP_ADD_SONG_REQUEST: {
      console.log(GROUP_ADD_SONG_REQUEST);
      return state;
    }
    case GROUP_ADD_SONG_ERROR: {
      console.log(GROUP_ADD_SONG_ERROR);
      return state;
    }
    case GROUP_ADD_SONG_SUCCESS: {
      console.log(GROUP_ADD_SONG_SUCCESS);
      return state;
    }
    case GROUP_SELECT: {
      console.log(GROUP_SELECT);
      return {
        ...state,
        selectedGroupID: action.payload.groupID
      };
    }
    case GROUP_FOLLOW_PLAYLIST_REQUEST: {
      console.log(GROUP_FOLLOW_PLAYLIST_REQUEST);
      return state;
    }
    case GROUP_FOLLOW_PLAYLIST_ERROR: {
      console.log(GROUP_FOLLOW_PLAYLIST_ERROR);
    }
    case GROUP_FOLLOW_PLAYLIST_SUCCESS: {
      console.log(GROUP_ADD_SONG_SUCCESS);
      const groupID = action.payload.groupID;
      return {
        ...state,
        groupFollowStatusByID: {
          ...state.groupFollowStatusByID,
          [groupID]: true
        }
      };
    }
    case SOCKET_RECEIVE_GROUP: {
      console.log(SOCKET_RECEIVE_GROUP);
      const group = action.payload.group;
      return {
        ...state,
        groupsByID: {
          ...state.groupsByID,
          [group.id]: group
        },
        groupFollowStatusByID: {
          ...state.groupFollowStatusByID,
          [group.id]: false
        }
      };
    }
    case SOCKET_RECEIVE_SEARCH_SONG_START: {
      console.log(SOCKET_RECEIVE_SEARCH_SONG_START);
      const userID = action.payload.userID;
      const groupID = action.payload.groupID;
      let usersSearchingForSongs = state.usersSearchingForSongsByGroupID[groupID];
      if (!usersSearchingForSongs) {
        usersSearchingForSongs = [userID];
      }
      else if (usersSearchingForSongs.indexOf(userID) < 0) {
        usersSearchingForSongs = usersSearchingForSongs.concat([userID]);
      }

      return {
        ...state,
        usersSearchingForSongsByGroupID: {
          ...state.usersSearchingForSongsByGroupID,
          [groupID]: usersSearchingForSongs
        }
      };
    }
    case SOCKET_RECEIVE_SEARCH_SONG_STOP: {
      console.log(SOCKET_RECEIVE_SEARCH_SONG_STOP);
      const userID = action.payload.userID;
      const groupID = action.payload.groupID;
      let usersSearchingForSongs = state.usersSearchingForSongsByGroupID[groupID];
      if (!usersSearchingForSongs) {
        usersSearchingForSongs = [];
      }
      else if (usersSearchingForSongs.indexOf(userID) >= 0) {
        usersSearchingForSongs = usersSearchingForSongs.filter(id => { return id !== userID})
      }

      return {
        ...state,
        usersSearchingForSongsByGroupID: {
          ...state.usersSearchingForSongsByGroupID,
          [groupID]: usersSearchingForSongs
        }
      };
    }
    case SOCKET_RECEIVE_SEARCH_SONG_STOP: {
      return {
        ...state
      };
    }
    default:
      return state;
  }
};

export const selectUserGetGroupsError = (state) => {
  return state.group.userGetGroupsError;
};

export const selectUserGetGroupsSuccess = (state) => {
  return state.group.userGetGroupsSuccess;
};

export const selectGroups = (state) => {
  return Object.values(state.group.groupsByID);
};

export const selectGroupsOrderedByLastUpdateTime = (state) => {

  const groupsLastUpdateTimeComparator = (groupA, groupB) => {
    if (groupA.lastUpdateTime === null && groupB.lastUpdateTime === null) {
      return 0;
    }
    if (groupA.lastUpdateTime === null) {
      return 1;
    }
    if (groupB.lastUpdateTime === null) {
      return -1;
    }
    return groupA.lastUpdateTime > groupB.lastUpdateTime ? -1 : groupA.lastUpdateTime < groupB.lastUpdateTime ? 1 : 0;
  };

  let groups = Object.values(state.group.groupsByID);
  groups.sort(groupsLastUpdateTimeComparator);
  return groups;
};

export const selectSelectedGroupID = (state) => {
  return state.group.selectedGroupID;
};


export const selectSelectedGroup = (state) => {
  return state.group.groupsByID[state.group.selectedGroupID];
};

export const selectGroupFollowStatusByID = (state) => {
  return state.group.groupFollowStatusByID;
};

export const selectUsersSearchingForSongsForGroupID = (state, groupID) => {
  return state.group.usersSearchingForSongsByGroupID[groupID];
};