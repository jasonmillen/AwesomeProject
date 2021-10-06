import * as userAPI from '../api/spotify/user';
import * as playlistAPI from '../api/spotify/playlist';

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
      // get all playlist that a user follows
      let playlists = await userAPI.getUserPlaylists();

      // filter out playlists owned by user or owned by the spotify account
      playlists = playlists.filter(playlist =>
        playlist.owner && 
        playlist.owner.id && 
        playlist.owner.id !== userID && 
        playlist.owner.id !=='spotify'
      );

      // get full info on playlist (not all info is originally returned by getUserPlaylists() call)
      playlists = await Promise.all(playlists.map(async playlist => {
        return await playlistAPI.getPlaylist(playlist.id);
      }));

      // filter playlists so that a user's own playlists are not included
      const friendInfo = playlists.reduce((map, playlist) => {

        // if (playlist.name === 'YNP') {
        //   console.log(playlist);
        // }

        const playlistObj = {
          id: playlist.id,
          name: playlist.name,
          followers: playlist.followers.total,
        };
        const spotifyId = playlist.owner.id;
        if (map.has(spotifyId)) {
          map.get(spotifyId).playlists.push(playlistObj);
        }
        else {
          map.set(spotifyId, { playlists: [playlistObj] });
        }

        return map;
      }, new Map() /* { set: new Set(), friendInfo: [] }*/);

      //console.log("FRIEND PLAYLISTS: ", friendInfo);

      await Promise.all(Array.from(friendInfo.keys()).map(async spotifyId => {
        const user = await userAPI.searchUser(spotifyId);
        friendInfo.get(spotifyId).user = {
          displayName: user.display_name,
          imageUrl: user.images && user.images.length > 0 ? user.images[0].url : null,
          spotifyUserID: user.id,
        }
      }));

      dispatch(friendsGetSuccess(friendInfo));
    }
    catch (error) {
      console.error(error);
      dispatch(friendsGetError());
    }
  }
}