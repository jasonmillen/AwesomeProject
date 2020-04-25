import * as serverAPI from '../api/server/server';
import * as trackAPI from '../api/spotify/track';

export const MESSAGES_GET_FOR_GROUP_REQUEST = 'MESSAGES_GET_FOR_GROUP';
export const MESSAGES_GET_FOR_GROUP_ERROR = 'MESSAGES_GET_FOR_ERROR';
export const MESSAGES_GET_FOR_GROUP_SUCCESS = 'MESSAGES_GET_FOR_SUCCESS';

export const messagesGetForGroupRequest = (groupID) => {
  return {
    type: MESSAGES_GET_FOR_GROUP_REQUEST,
    payload: {
      groupID
    }
  };
};
 
export const messagesGetForGroupError = (groupID) => {
  return {
    type: MESSAGES_GET_FOR_GROUP_ERROR,
    payload: {
      groupID
    }
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
    dispatch(messagesGetForGroupRequest(groupID));

    try {
      const messages = await serverAPI.groupGetMessages(groupID);

      await Promise.all(messages.map(async message => {
        if (message.trackID) {
          message.trackInfo = await trackAPI.getTrack(message.trackID);
        }
      }));
      dispatch(messagesGetForGroupSuccess(groupID, messages));
    }
    catch(error) {
      console.error(`Error getting messages for groupID: ${groupID}, `, error);
      dispatch(messagesGetForGroupError(groupID));
    }

  };
};