import {
  MESSAGES_GET_FOR_GROUP_REQUEST,
  MESSAGES_GET_FOR_GROUP_ERROR,
  MESSAGES_GET_FOR_GROUP_SUCCESS
} from '../actions/messageActions';

import {
  GROUP_ADD_SONG_SUCCESS
} from '../actions/groupActions';

import {
  LOGOUT_SUCCESS
} from '../actions/userActions';

import {
  SOCKET_SEND_SONG
} from '../actions/socketActions';

const initialState = {
  messagesByGroupID: {},
  messagesGetForRequestGroupByGroup: {},
  messagesGetForErrorGroupByGroup: {},
  messagesGetForSuccessGroupByGroup: {}
};

export default messageReducer = (state = initialState, action) => {

  switch (action.type) {
    case MESSAGES_GET_FOR_GROUP_REQUEST: {
      console.log(MESSAGES_GET_FOR_GROUP_REQUEST);
      const groupID = action.payload.groupID;
      return {
        ...state,
        messagesGetForRequestGroupByGroup: {
          ...state.messagesGetForRequestGroupByGroup,
          [groupID]: true
        }
      };
    }
    case MESSAGES_GET_FOR_GROUP_ERROR: {
      console.log(MESSAGES_GET_FOR_GROUP_ERROR);
      const groupID = action.payload.groupID;
      return {
        ...state,
        messagesGetForErrorGroupByGroup: {
          ...state.messagesGetForErrorGroupByGroup,
          [groupID]: true
        }
      };
    }
    case MESSAGES_GET_FOR_GROUP_SUCCESS: {
      console.log(MESSAGES_GET_FOR_GROUP_SUCCESS);
      const groupID = action.payload.groupID;
      const messages = action.payload.messages;
      return {
        ...state,
        messagesByGroupID: {
          ...state.messagesByGroupID,
          [groupID]: messages
        },
        messagesGetForSuccessGroupByGroup: {
          ...state.messagesGetForSuccessGroupByGroup,
          [groupID]: true
        }
      };
    }
    case GROUP_ADD_SONG_SUCCESS: {
      const message = action.payload.message;
      const messages = state.messagesByGroupID[message.groupID];
      messages.push(message);
      return {
        ...state,
        messagesByGroupID: {
          ...state.messagesByGroupID,
          [message.groupID]: messages
        }
      } 
    }
    case LOGOUT_SUCCESS: {
      return initialState;
    }
    case SOCKET_SEND_SONG: {
      console.log('SOCKET_SEND_SONG');
      const message = action.payload.message;
      const groupID = message.groupID;
      return {
        ...state,
        messagesByGroupID: {
          ...state.messagesByGroupID,
          //[groupID]: state.messagesByGroupID[groupID].concat([message])
          [groupID]: [message].concat(state.messagesByGroupID[groupID])
        }
      }
    }
    default: {
      return state;
    }
  };

};

export const selectMessagesForGroup = (state, groupID) => {
  return state.message.messagesByGroupID[groupID];
};

export const selectMessagesGetForGroupRequest = (state, groupID) => {
  return state.message.messagesGetForRequestGroupByGroup[groupID];
};

export const selectMessagesGetForGroupError = (state, groupID) => {
  return state.message.messagesGetForErrorGroupByGroup[groupID];
};

export const selectMessagesGetForGroupSuccess = (state, groupID) => {
  return state.message.messagesGetForSuccessGroupByGroup[groupID];
};