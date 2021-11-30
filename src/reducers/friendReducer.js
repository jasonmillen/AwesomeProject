import {
  FRIENDS_GET_REQUEST,
  FRIENDS_GET_ERROR,
  FRIENDS_GET_SUCCESS,
} from '../actions/friendActions';

import {
  USER_GET_USERS_SUCCESS
} from '../actions/groupActions';

const initialState = {
  friends: new Map(),
  suggestedUsers: [],
  suggestedUsersMap: new Map()
};

const calculateSuggestedUsers = (suggestedUsersMap) => {
  const suggestedUsers = [];
  suggestedUsersMap.forEach((value, key) => {
    if (true) { // TODO: replace this with check to see if key === current logged in users spotifyuserid
      suggestedUsers.push(value);
    }
  });
  suggestedUsers.sort((a, b) => {
    const aScore = a.playlistScore + a.groupScore;
    const bScore = b.playlistScore + b.groupScore;
    return bScore - aScore;
  });
  return suggestedUsers;
};

export default friendReducer = (state = initialState, action, spotifyUserID) => {
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
      const friends = action.payload.friends;

      const suggestedUsersMap = new Map(state.suggestedUsersMap);
      friends.forEach((value, key) => {
        if (key === spotifyUserID) {
          return;
        }
        let min = Number.MAX_SAFE_INTEGER;
        value.playlists.forEach(playlist => {
          if (playlist.followers < min) {
            min = playlist.followers;
          }
        });
        min = Math.max(min, 1); // prevent min value of 0

        if (suggestedUsersMap.has(key)) {
          suggestedUsersMap.get(key).playlistScore = (1 / min);
        }
        else {
          suggestedUsersMap.set(key, {
            user: value.user, playlistScore: (1 / min), groupScore: 0
          });
        }
      });

      const suggestedUsers = calculateSuggestedUsers(suggestedUsersMap);
      // console.log("NEW SUGGESTED USERS1: ", suggestedUsers);

      return {
        ...state,
        friends,
        suggestedUsers,
        suggestedUsersMap,
      };
    }
    case USER_GET_USERS_SUCCESS: {
      const users = action.payload.users;
      const suggestedUsersMap = new Map(state.suggestedUsersMap);
      users.forEach(user => {
        if (user.spotifyUserID === spotifyUserID) {
          return;
        }
        if (suggestedUsersMap.has(user.spotifyUserID)) {
          suggestedUsersMap.get(user.spotifyUserID).groupScore = 1;
        }
        else {
          suggestedUsersMap.set(user.spotifyUserID, {
            user, playlistScore: 0, groupScore: 1
          });
        }
      });

      const suggestedUsers = calculateSuggestedUsers(suggestedUsersMap);
      // console.log("NEW SUGGESTED USERS2: ", suggestedUsers);

      return {
        ...state,
        suggestedUsers,
        suggestedUsersMap,
      }
    }
    default: {
      return state;
    }
  }
};

export const selectFriends = (state) => {
  return state.friend.friends;
}

export const selectSuggestedUsers = (state) => {
  return state.friend.suggestedUsers;
}

export const selectSuggestedUsersMap = (state) => {
  return state.friend.suggestedUsersMap;
}