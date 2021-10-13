import SpotifyWebApi from 'spotify-web-api-js';
import * as asAPI from '../api/asyncStorage/asyncStorage';
import { getAuthorizationCode } from '../api/spotify/auth';
import * as serverAPI from '../api/server/server';
import * as userAPI from '../api/spotify/user';
import * as trackAPI from '../api/spotify/track';

import { clearTokenData } from '../api/spotify/token';
import { clearSsTokenData } from '../api/server/ssToken';


export const SET_LOGGED_IN_USER_REQUEST = 'SET_LOGGED_IN_USER_REQUEST';
export const SET_LOGGED_IN_USER_SUCCESS = 'SET_LOGGED_IN_USER_SUCCESS';

// export const setLoggedInUserRequest = (spotifyUserID) => {
//   return {
//     type: SET_LOGGED_IN_USER_REQUEST,
//     payload: {
//       spotifyUserID
//     }
//   };
// };


// export const setLoggedInUserSuccess = (spotifyUserID) => {
//   return {
//     type: SET_LOGGED_IN_USER_SUCCESS,
//     payload: {
//       spotifyUserID
//     }
//   };
// };

// export const setLoggedInUser = (spotifyUserID) => {
//   return async (dispatch) => {
//     dispatch(setLoggedInUserRequest(spotifyUserID));
//     //await setUserID(userID);
//     await asAPI.setSpotifyUserID(spotifyUserID);
//     dispatch(setLoggedInUserSuccess(spotifyUserID));
//   }
// };

export const GET_LOGGED_IN_USER_REQUEST = 'GET_LOGGED_IN_USER_REQEUST';
export const GET_LOGGED_IN_USER_ERROR = 'GET_LOGGED_IN_USER_ERROR';
export const GET_LOGGED_IN_USER_SUCCESS = 'GET_LOGGED_IN_USER_SUCCESS';

export const getLoggedInUserRequest = () => {
  return {
    type: GET_LOGGED_IN_USER_REQUEST,
    payload: {}
  };
};

export const getLoggedInUserError = () => {
  return {
    type: GET_LOGGED_IN_USER_ERROR,
    payload: {}
  };
};

export const getLoggedInUserSuccess = (userID, user, spotifyUserID, tokenData/*, ssTokenData*/) => {
  return {
    type: GET_LOGGED_IN_USER_SUCCESS,
    payload: {
      userID,
      user,
      spotifyUserID,
      tokenData,
      // ssTokenData
    }
  };
};

export const getLoggedInUser = () => {
  return async (dispatch) => {
    dispatch(getLoggedInUserRequest());
    
    try {
      //await asAPI.clear();
      const spotifyUserID = await asAPI.getSpotifyUserID();
      const tokenData = await asAPI.getTokenData();
      console.log(1);
      const ssTokenData = await asAPI.getSsTokenData();

      if (!spotifyUserID || !tokenData || !ssTokenData) {
        // should switch this to just return not logged in - shouldn't have to throw error here
        throw new Error('No logged in user');
      }

      let user = await serverAPI.getUserBySpotifyUserID(spotifyUserID);
      if (user) {
        await asAPI.setUserID(user.id);
        const userInfo = await userAPI.searchUser(spotifyUserID);
        user.displayName = userInfo.display_name;
        user.imageUrl = userInfo.images.length ? userInfo.images[0].url : null;
        dispatch(getLoggedInUserSuccess(user.id, user, spotifyUserID, tokenData/*, ssTokenData*/));
      }
      else {
        dispatch (getLoggedInUserError());
      }
    }
    catch (error) {
      console.log('Error getting logged in user');
      dispatch (getLoggedInUserError());
    }
  };
}

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const COMPLETE_LOGIN_PROCESS = 'COMPLETE_LOGIN_PROCESS';

export const loginRequest = () => {
  return {
    type: LOGIN_REQUEST,
    payload: {}
  };
}

export const loginSuccess = (tokenData, /*ssTokenData,*/ userID, spotifyUserID, user) => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      tokenData,
      // ssTokenData,
      userID,
      spotifyUserID,
      user
    }
  };
}

export const completeLoginProcess = () => {
  return {
    type: COMPLETE_LOGIN_PROCESS
  }
};

export const login = () => {
  return async (dispatch) => {
    dispatch(loginRequest());
    const authCode = await getAuthorizationCode();
    console.log("authCode: ", authCode);

    const { tokenData, ssTokenData } = await serverAPI.getSpotifyTokenData(authCode);
    console.log("token data: ", tokenData);
  
    await asAPI.saveTokenData(
      tokenData.accessToken, 
      tokenData.expirationTime, 
      tokenData.refreshToken);

    await asAPI.saveSsTokenData(
      ssTokenData.ssAccessToken,
      ssTokenData.ssExpirationTime,
      ssTokenData.ssRefreshToken);

    const spotify = new SpotifyWebApi();
    spotify.setAccessToken(tokenData.accessToken);
    const spotifyUserData = await spotify.getMe();
    
    console.log('LOGIN USER DATA: ', spotifyUserData);

    await asAPI.setSpotifyUserID(spotifyUserData.id);

    let user = await serverAPI.getUserBySpotifyUserID(spotifyUserData.id);

    // user should always be created now in the serverAPI.getSpotifyTokenData call - shouldn't need this check in the future
    // if (!user || !user.id) {
    //   user = await serverAPI.addNewUser(spotifyUserData.id);
    // }

    if (!user || !user.id) {
      console.error("Error getting user during login process");
      throw new error("Error getting user during login process");
    }

    await asAPI.setUserID(user.id);
    user.displayName = spotifyUserData.display_name;
    user.imageUrl = spotifyUserData.images.length ? spotifyUserData.images[0].url : null

    dispatch(loginSuccess(tokenData, /*ssTokenData,*/ user.id, spotifyUserData.id, user));
  };
}

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const logoutRequest = () => {
  return {
    type: LOGOUT_REQUEST,
    payload: {}
  };
};

export const logoutError = () => {
  return {
    type: LOGOUT_ERROR,
    payload: {}
  };
};

export const logoutSuccess = () => {
  return {
    type: LOGOUT_SUCCESS,
    payload: {}
  };
};

export const fetchLogout = () => {
  return async (dispatch) => {
    dispatch (logoutRequest());

    try {
      clearTokenData();
      clearSsTokenData();
      await asAPI.removeSpotifyUserIDAndTokenData();
      dispatch (logoutSuccess());
    }
    catch (error) {
      dispatch (logoutError());
    }
  };
};


export const GET_RECOMMENDED_TRACKS_REQUEST = 'GET_RECOMMENDED_TRACKS_REQUEST';
export const GET_RECOMMENDED_TRACKS_ERROR = 'GET_RECOMMENDED_TRACKS_ERROR';
export const GET_RECOMMENDED_TRACKS_SUCCESS = 'GET_RECOMMENDED_TRACKS_SUCCESS';

export const getRecommendedTracksRequest = () => {
  return {
    type: GET_RECOMMENDED_TRACKS_REQUEST,
    payload: {}
  };
};

export const getRecommendedTracksError = () => {
  return {
    type: GET_RECOMMENDED_TRACKS_ERROR,
    payload: {}
  };
};

export const getRecommendedTracksSuccess = (tracks) => {
  return {
    type: GET_RECOMMENDED_TRACKS_SUCCESS,
    payload: {
      tracks
    }
  };
};

export const fetchGetRecommendedTracks = () => {
  return async (dispatch) => {
    dispatch (getRecommendedTracksRequest());

    try {

      let recommendedTracks = [];
      const trackIDs = new Set();

      let recentlyPlayedTracks = await trackAPI.getRecentlyPlayedTracks();
      recentlyPlayedTracks.forEach(track => {
        track = track.track;
        if (!trackIDs.has(track.id)) {
          trackIDs.add(track.id);
          recommendedTracks.push(trackAPI.normalizeTrack(track));
        }
      });
      if (recentlyPlayedTracks.length < 20) {
        console.log('GETTING TOP TRACKS');
        let topTracks = await trackAPI.getTopTracks();
      }
      if (recentlyPlayedTracks.length < 20) {
        console.log('GETTING VIRAL TRACKS');
        let viralTracks = await trackAPI.getTop50ViralGlobalTracks();
        viralTracks.forEach(track => {
          track = track.track;
          if (!trackIDs.has(track.id)) {
            trackIDs.add(track.id);
            recommendedTracks.push(trackAPI.normalizeTrack(track));
          }
        });
      }

      // console.log('REC TRACKS: ', recommendedTracks);

      dispatch (getRecommendedTracksSuccess(recommendedTracks));
    }
    catch (error) {
      console.log('Error getting recommended tracks: ', error);
      dispatch (getRecommendedTracksError());
    }
  };
};