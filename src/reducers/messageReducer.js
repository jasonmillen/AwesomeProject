import {
  MESSAGES_GET_FOR_GROUP_REQUEST,
  MESSAGES_GET_FOR_GROUP_ERROR,
  MESSAGES_GET_FOR_GROUP_SUCCESS
} from '../actions/messageActions';

const initialState = {
  messagesByGroupID: {}
};

export default messageReducer = (state = initialState, action) => {

  switch (action.type) {
    case MESSAGES_GET_FOR_GROUP_REQUEST: {
      console.log(MESSAGES_GET_FOR_GROUP_REQUEST);
      return state;
    }
    case MESSAGES_GET_FOR_GROUP_ERROR: {
      console.log(MESSAGES_GET_FOR_GROUP_ERROR);
      return state;
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
        }
      };
    }
    default: {
      return state;
    }
  };

};

export const selectMessagesForGroup = (state, groupID) => {
  console.log("selecting messages for groupid: ", groupID);
  console.log('messages by groupid', state.message.messagesByGroupID)
  return state.message.messagesByGroupID[groupID];
};