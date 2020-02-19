import {
  GROUP_CREATE_REQUEST,
  GROUP_CREATE_ERROR,
  GROUP_CREATE_SUCCESS,
  USER_GET_GROUPS_REQUEST,
  USER_GET_GROUPS_ERROR,
  USER_GET_GROUPS_SUCCESS
} from '../actions/groupActions';

const initialState = {
  groups: []
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
      return state;
    }
    case USER_GET_GROUPS_ERROR: {
      console.log(USER_GET_GROUPS_ERROR);
      return state;
    }
    case USER_GET_GROUPS_SUCCESS: {
      console.log(USER_GET_GROUPS_SUCCESS);
      console.log(action.payload.groups);
      return {
        ...state,
        groups: action.payload.groups
      }
    }
    default:
      return state;
  }
};

export const selectGroups = (state) => {
  return state.group.groups;
}
