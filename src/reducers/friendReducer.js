import {
  FRIENDS_GET_REQUEST,
  FRIENDS_GET_ERROR,
  FRIENDS_GET_SUCCESS,
} from '../actions/friendActions';

const initialState = {
  friends: new Map()
};

export default friendReducer = (state = initialState, action) => {
  switch (action.type) {
    case FRIENDS_GET_REQUEST: {
      console.log(FRIENDS_GET_REQUEST);
      return state;
    }
    case FRIENDS_GET_ERROR: {
      console.log(FRIENDS_GET_ERROR);
      return state;
    }
    case FRIENDS_GET_SUCCESS: {
      console.log(FRIENDS_GET_SUCCESS);
      return {
        ...state,
        friends: action.payload.friends
      };
    }
    default: {
      return state;
    }
  }
};

export const selectFriends = (state) => {
  return state.friend.friends;
}