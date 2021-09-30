//import { ws } from '../api/server/socket';
import { WS_URL } from '../../config';

import * as trackAPI from '../api/spotify/track';
import * as playlistAPI from '../api/spotify/playlist';

const MESSAGE_TYPE = {
  REGISTER_USER: 'REGISTER_USER',
  SEND_SONG: 'SEND_SONG',
  SEND_TEXT_MESSAGE: 'SEND_TEXT_MESSAGE',
  CREATE_GROUP: 'CREATE_GROUP',
  SEARCH_SONG_START: 'SEARCH_SONG_START',
  SEARCH_SONG_STOP: 'SEARCH_SONG_STOP',
  TYPING_MESSAGE_START: 'TYPING_MESSAGE_START',
  TYPING_MESSAGE_STOP: 'TYPING_MESSAGE_STOP',
};

let ws = null;

export const REGISTER_USER = 'REGISTER_USER';
export const registerUser = () => {
  return {
    type: REGISTER_USER,
    payload: {}
  };
};


export const SOCKET_RECEIVE_SONG = 'SOCKET_RECEIVE_SONG';
export const socketReceiveSong = (message) => {
  return {
    type: SOCKET_RECEIVE_SONG,
    payload: {
      message
    }
  };
};

export const SOCKET_RECEIVE_TEXT_MESSAGE = 'SOCKET_RECEIVE_TEXT_MESSAGE';
export const socketReceiveTextMessage = (message) => {
  return {
    type: SOCKET_RECEIVE_TEXT_MESSAGE,
    payload: {
      message
    }
  };
};

export const SOCKET_RECEIVE_GROUP = 'SOCKET_RECEIVE_GROUP';
export const socketReceiveGroup = (group) => {
  return {
    type: SOCKET_RECEIVE_GROUP,
    payload: {
      group
    }
  };
};

export const SOCKET_RECEIVE_SEARCH_SONG_START = 'SOCKET_RECEIVE_SEARCH_SONG_START';
export const socketReceiveSearchSongStart = (userID, groupID) => {
  return {
    type: SOCKET_RECEIVE_SEARCH_SONG_START,
    payload: {
      userID,
      groupID
    }
  };
};

export const SOCKET_RECEIVE_SEARCH_SONG_STOP = 'SOCKET_RECEIVE_SEARCH_SONG_STOP';
export const socketReceiveSearchSongStop = (userID, groupID) => {
  return {
    type: SOCKET_RECEIVE_SEARCH_SONG_STOP,
    payload: {
      userID,
      groupID
    }
  }
};

export const SOCKET_RECEIVE_TYPING_MESSAGE_START = 'SOCKET_RECEIVE_TYPING_MESSAGE_START';
export const socketReceiveTypingMessageStart = (userID, groupID) => {
  return {
    type: SOCKET_RECEIVE_TYPING_MESSAGE_START,
    payload: {
      userID,
      groupID
    }
  };
};

export const SOCKET_RECEIVE_TYPING_MESSAGE_STOP = 'SOCKET_RECEIVE_TYPING_MESSAGE_STOP';
export const socketReceiveTypingMessageStop = (userID, groupID) => {
  return {
    type: SOCKET_RECEIVE_TYPING_MESSAGE_STOP,
    payload: {
      userID,
      groupID
    }
  };
};


const searchSongTimeoutIds = new Map();
const typingMessageTimeoutIds = new Map();

export const initSocket = (userID) => {
  return async (dispatch) => {

    if (ws) {
      console.log('SOCKET ALREADY CREATED');
      return;
    }

    ws = new WebSocket(`${WS_URL}/app`);

    ws.onopen = () => {
      console.log('OPENED!!');

      const registerMessage = {
        type: MESSAGE_TYPE.REGISTER_USER,
        userID
      };

      ws.send(JSON.stringify(registerMessage));
    };

    ws.onmessage = async (data) => {

      const payload = JSON.parse(data.data);
      console.log('GOT PAYLOAD: ', payload);

      switch (payload.type) {
        case MESSAGE_TYPE.REGISTER_USER: {
          dispatch(registerUser());
          return;
        }
        case MESSAGE_TYPE.SEND_SONG: {
          const message = payload.message;
          message.trackInfo = await trackAPI.getTrack(message.trackID);
          dispatch(socketReceiveSong(message));
          return;
        }
        case MESSAGE_TYPE.SEND_TEXT_MESSAGE: {
          const message = payload.message;
          dispatch(socketReceiveTextMessage(message));
          return;
        }
        case MESSAGE_TYPE.CREATE_GROUP: {
          const group = payload.group;
          // TODO: process user info as well
          const playlistInfo = await playlistAPI.getPlaylist(group.playlistID);
          group.imageUrl = playlistInfo.images.length > 0 ? playlistInfo.images[0].url : "";
          group.playlistName = playlistInfo.name;
          dispatch(socketReceiveGroup(group));
          return;
        }
        case MESSAGE_TYPE.SEARCH_SONG_START: {
          const userID = payload.userID;
          const groupID = payload.groupID;

          const key = userID + "_" + groupID;
          if (searchSongTimeoutIds.has(key)) {
            clearTimeout(searchSongTimeoutIds.get(key));
            searchSongTimeoutIds.delete(key);
          }
          
          const timeoutId = setTimeout(() => dispatch(socketReceiveSearchSongStop(userID, groupID)), 7 * 1000);
          searchSongTimeoutIds.set(key, timeoutId);

          dispatch(socketReceiveSearchSongStart(userID, groupID));
          return;
        }
        case MESSAGE_TYPE.SEARCH_SONG_STOP: {
          const userID = payload.userID;
          const groupID = payload.groupID;
          dispatch(socketReceiveSearchSongStop(userID, groupID));
          return;
        }
        case MESSAGE_TYPE.TYPING_MESSAGE_START: {
          const userID = payload.userID;
          const groupID = payload.groupID;

          const key = userID + "_" + groupID;
          if (typingMessageTimeoutIds.has(key)) {
            clearTimeout(typingMessageTimeoutIds.get(key));
            typingMessageTimeoutIds.delete(key);
          }
          
          const timeoutId = setTimeout(() => dispatch(socketReceiveTypingMessageStop(userID, groupID)), 7 * 1000);
          typingMessageTimeoutIds.set(key, timeoutId);

          dispatch(socketReceiveTypingMessageStart(userID, groupID));
          return;
        }
        case MESSAGE_TYPE.TYPING_MESSAGE_STOP: {
          const userID = payload.userID;
          const groupID = payload.groupID;
          dispatch(socketReceiveTypingMessageStop(userID, groupID));
          return;
        }
        default: {
          console.log('Unknown message type');
          return;
        }
      }
    };
  };
};


///////////// API ////////////////
export const groupAddSong = (message) => {

  const payload = {
    type: MESSAGE_TYPE.SEND_SONG,
    ...message
  };


  ws.send(JSON.stringify(payload));
};

export const groupSendTextMessage = (message) => {
  
  const payload = {
    type: MESSAGE_TYPE.SEND_TEXT_MESSAGE,
    ...message
  };

  console.log("sending over socket");
  ws.send(JSON.stringify(payload));
};

export const createGroup = (group) => {

  const payload = {
    type: MESSAGE_TYPE.CREATE_GROUP,
    ...group
  };

  ws.send(JSON.stringify(payload));
};

export const searchSongStart = (userID, groupID) => {

  console.log('SENDING SEARCHING FOR SONG START');

  const payload = {
    type: MESSAGE_TYPE.SEARCH_SONG_START,
    userID,
    groupID
  };

  ws.send(JSON.stringify(payload));
};

export const searchSongStop = (userID, groupID) => {

  console.log('SENDING SEARCHING FOR SONG STOP');

  const payload = {
    type: MESSAGE_TYPE.SEARCH_SONG_STOP,
    userID,
    groupID
  };

  ws.send(JSON.stringify(payload));
};

export const typingMessageStart = (userID, groupID) => {

  console.log('SENDING TYPING MESSAGE START');

  const payload = {
    type: MESSAGE_TYPE.TYPING_MESSAGE_START,
    userID,
    groupID
  };

  ws.send(JSON.stringify(payload));
};

export const typingMessageStop = (userID, groupID) => {

  console.log('SENDING TYPING MESSAGE STOP');

  const payload = {
    type: MESSAGE_TYPE.TYPING_MESSAGE_STOP,
    userID,
    groupID
  };

  ws.send(JSON.stringify(payload));
};