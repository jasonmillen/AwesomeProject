import {
  MESSAGES_GET_FOR_GROUP_REQUEST,
  MESSAGES_GET_FOR_GROUP_ERROR,
  MESSAGES_GET_FOR_GROUP_SUCCESS
} from '../actions/messageActions';

import {
  GROUP_ADD_SONG_SUCCESS,
  GROUP_SEND_TEXT_MESSAGE_SUCCESS,
} from '../actions/groupActions';

import {
  LOGOUT_SUCCESS
} from '../actions/userActions';

import {
  SOCKET_RECEIVE_SONG,
  SOCKET_RECEIVE_TEXT_MESSAGE,
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
      // console.log(MESSAGES_GET_FOR_GROUP_REQUEST);
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
      // console.log(MESSAGES_GET_FOR_GROUP_ERROR);
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
      // console.log(MESSAGES_GET_FOR_GROUP_SUCCESS);
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
      const messages = [message].concat(state.messagesByGroupID[message.groupID]);
      return {
        ...state,
        messagesByGroupID: {
          ...state.messagesByGroupID,
          [message.groupID]: messages
        }
      };
    }
    case GROUP_SEND_TEXT_MESSAGE_SUCCESS: {
      const message = action.payload.message;
      console.log("BEFORE: " + state.messagesByGroupID[message.groupID].length);
      const messages = [message].concat(state.messagesByGroupID[message.groupID]);
      console.log("AFTER: " + messages.length);
      return {
        ...state,
        messagesByGroupID: {
          ...state.messagesByGroupID,
          [message.groupID]: messages
        }
      };
    }
    case LOGOUT_SUCCESS: {
      return initialState;
    }
    case SOCKET_RECEIVE_SONG: {
      console.log(SOCKET_RECEIVE_SONG);
      const message = action.payload.message;
      const groupID = message.groupID;
      return {
        ...state,
        messagesByGroupID: {
          ...state.messagesByGroupID,
          [groupID]: [message].concat(state.messagesByGroupID[groupID])
        }
      }
    }
    
    case SOCKET_RECEIVE_TEXT_MESSAGE: {
      console.log(SOCKET_RECEIVE_TEXT_MESSAGE);
      const message = action.payload.message;
      const groupID = message.groupID;
      return {
        ...state,
        messagesByGroupID: {
          ...state.messagesByGroupID,
          [groupID]: [message].concat(state.messagesByGroupID[groupID])
        }
      }
    }
    default: {
      return state;
    }
  };
};

export const selectMessagesByGroupID = (state) => {
  return state.message.messagesByGroupID;
};

export const selectMessagesForGroup = (state, groupID) => {
  return state.message.messagesByGroupID[groupID];
};

export const selectMessagesGetForGroupRequest = (state, groupID) => {
  return state.message.messagesGetForRequestGroupByGroup[groupID];
};

export const selectMessagesGetForGroupRequestByGroupID = (state) => {
  return state.message.messagesGetForRequestGroupByGroup;
};

export const selectMessagesGetForGroupError = (state, groupID) => {
  return state.message.messagesGetForErrorGroupByGroup[groupID];
};

export const selectMessagesGetForGroupErrorByGroupID = (state) => {
  return state.message.messagesGetForErrorGroupByGroup;
};

export const selectMessagesGetForGroupSuccess = (state, groupID) => {
  return state.message.messagesGetForSuccessGroupByGroup[groupID];
};

export const selectMessagesGetForGroupSuccessByGroupID = (state) => {
  return state.message.messagesGetForSuccessGroupByGroup;
};