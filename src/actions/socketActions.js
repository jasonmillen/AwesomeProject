//import { ws } from '../api/server/socket';
import { IP } from '../../config';

import * as trackAPI from '../api/spotify/track';
import * as playlistAPI from '../api/spotify/playlist';

const MESSAGE_TYPE = {
  REGISTER_USER: 'REGISTER_USER',
  SEND_SONG: 'SEND_SONG',
  CREATE_GROUP: 'CREATE_GROUP',
  SEARCH_SONG_START: 'SEARCH_SONG_START',
  SEARCH_SONG_STOP: 'SEARCH_SONG_STOP'
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

export const SOCKET_RECEIVE_GROUP = 'SOCKET_RECEIVE_GROUP';
export const socketReceiveGroup = (group) => {
  return {
    type: SOCKET_RECEIVE_GROUP,
    payload: {
      group
    }
  };
};


export const initSocket = (userID) => {
  return async (dispatch) => {

    if (ws) {
      console.log('SOCKET ALREADY CREATED');
      return;
    }

    ws = new WebSocket(`ws://${IP}:3000/app`);

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
        case MESSAGE_TYPE.CREATE_GROUP: {
          const group = payload.group;
          // TODO: process user info as well
          const playlistInfo = await playlistAPI.getPlaylist(group.playlistID);
          group.imageUrl = playlistInfo.images.length > 0 ? playlistInfo.images[0].url : "";
          group.playlistName = playlistInfo.name;
          dispatch(socketReceiveGroup(group));
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

export const createGroup = (group) => {

  const payload = {
    type: MESSAGE_TYPE.CREATE_GROUP,
    ...group
  };

  ws.send(JSON.stringify(payload));
};

export const searchSongStart = (userID, groupID) => {

  console.log('SENDING SEARCHING FOR SONG START');
  return;

  const payload = {
    type: MESSAGE_TYPE.SEARCH_SONG_START,
    userID,
    groupID
  };

  ws.send(JSON.stringify(payload));
};

export const searchSongStop = (userID, groupID) => {

  console.log('SENDING SEARCHING FOR SONG STOP');
  return;

  const payload = {
    type: MESSAGE_TYPE.SEARCH_SONG_STOP,
    userID,
    groupID
  };

  ws.send(JSON.stringify(payload));
};