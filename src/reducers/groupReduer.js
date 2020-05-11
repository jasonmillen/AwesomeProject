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

const initialState = {
  userGetGroupsSuccess: null,
  userGetGroupsError: null,
  groupsByID: {},
  groupFollowStatusByID: {},
  selectedGroupID: null
};

export default groupReducer = (state = initialState, action) => {
  switch (action.type) {
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
      console.log(action.payload.groupFollowStatusByID);
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
      }
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

export const selectSelectedGroupID = (state) => {
  return state.group.selectedGroupID;
};

export const selectSelectedGroup = (state) => {
  return state.group.groupsByID[state.group.selectedGroupID];
};

export const selectGroupFollowStatusByID = (state) => {
  return state.group.groupFollowStatusByID;
};