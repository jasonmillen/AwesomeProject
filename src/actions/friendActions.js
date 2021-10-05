import * as userAPI from '../api/spotify/user';

export const FRIENDS_GET_REQUEST = 'FRIENDS_GET_REQUEST';
export const FRIENDS_GET_ERROR = 'FRIENDS_GET_ERROR';
export const FRIENDS_GET_SUCCESS = 'FRIENDS_GET_SUCCESS';

export const friendsGetRequest = () => {
  return {
    type: FRIENDS_GET_REQUEST,
    payload: {}
  };
};

export const friendsGetError = () => {
  return {
    type: FRIENDS_GET_ERROR,
    payload: {}
  };
};

export const friendsGetSuccess = (friends) => {
  return {
    type: FRIENDS_GET_SUCCESS,
    payload: {
      friends
    }
  };
};


export const fetchFriendsGet = (userID) => {
  return async (dispatch) => {
    dispatch(friendsGetRequest());

    try {
      const userPlaylists = await userAPI.getUserPlaylists();

      // filter playlists so that a user's own playlists are not included
      // also ensure there are no duplicates
      const reducedValue = userPlaylists.reduce((prevValue, curPlaylist) => {
        if (curPlaylist.owner && 
          curPlaylist.owner.id && 
          curPlaylist.owner.id !== userID &&
          !prevValue.set.has(curPlaylist.owner.id)) {

          //console.log("ADDING: " + curPlaylist.name);
          prevValue.set.add(curPlaylist.owner.id);
          prevValue.friendInfo.push(
            { spotifyId: curPlaylist.owner.id, playlistName: curPlaylist.name });
        }

        return prevValue;
      }, { set: new Set(), friendInfo: [] });

      const friends = await Promise.all(reducedValue.friendInfo.map(async friendInfo => {
        const user = await userAPI.searchUser(friendInfo.spotifyId);
        user.playlistName = friendInfo.playlistName;
        return user;
      }));

      dispatch(friendsGetSuccess(friends));
    }
    catch (error) {
      console.error(error);
      dispatch(friendsGetError());
    }
  }
}