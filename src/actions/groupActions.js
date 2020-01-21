import { verifyTokenData } from '../api/spotify/util';
import { createPlaylist } from '../api/spotify/playlist';
import { setUserTokensSucces } from './tokenActions';

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

export const fetchCreateGroup = (creatorID, memberIDs, tokenData) => {
  return async (dispatch) => {
    dispatch(groupCreateRequest());

    if (await verifyTokenData(tokenData)) {
      dispatch (setUserTokensSuccess(tokenData));
    }



  };
};