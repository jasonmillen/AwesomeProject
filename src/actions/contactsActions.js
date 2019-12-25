import {
  verifyTokenData
} from './tokenActions';

import {
   getContacts
} from '../api/spotify/util';

export const GET_USER_CONTACTS_REQUEST = 'GET_USER_CONTACTS_REQUEST';
export const GET_USER_CONTACTS_SUCCESS = 'GET_USER_CONTACTS_SUCCESS';

export const getUserContactsRequest = () => {
  return {
    type: GET_USER_CONTACTS_REQUEST,
    payload: {}
  };
};

export const getUserContactsSuccess = (contacts) => {
  return {
    type: GET_USER_CONTACTS_SUCCESS,
    payload: {
      contacts
    }
  };
}

export const fetchUserContacts = (userID, tokenData) => {
  return async (dispatch) => {
    dispatch(getUserContactsRequest());
    verifyTokenData(tokenData);
    const contacts = await getContacts(userID, tokenData.accessToken);



  };
}