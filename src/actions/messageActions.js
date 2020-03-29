import * as serverAPI from '../api/server/server';

export const MESSAGES_GET_FOR_GROUP_REQUEST = 'MESSAGES_GET_FOR_GROUP';
export const MESSAGES_GET_FOR_GROUP_ERROR = 'MESSAGES_GET_FOR_ERROR';
export const MESSAGES_GET_FOR_GROUP_SUCCESS = 'MESSAGES_GET_FOR_SUCCESS';

export const messagesGetForGroupRequest = () => {
  return {
    type: MESSAGES_GET_FOR_GROUP_REQUEST,
    payload: {}
  };
};
 
export const messagesGetForGroupError = () => {
  return {
    type: MESSAGES_GET_FOR_GROUP_ERROR,
    payload: {}
  };
};

export const messagesGetForGroupSuccess = (groupID, messages) => {
  return {
    type: MESSAGES_GET_FOR_GROUP_SUCCESS,
    payload: {
      groupID,
      messages
    }
  };
};

export const fetchMessagesGetForGroup = (groupID) => {
  return async (dispatch) => {
    dispatch(messagesGetForGroupRequest());

    try {
      const messages = await serverAPI.groupGetMessages(groupID);
      dispatch(messagesGetForGroupSuccess(groupID, messages));
    }
    catch(error) {
      console.error(`Error getting messages for groupID: ${groupID}, `, error);
      dispatch(messagesGetForGroupError());
    }

  };
};