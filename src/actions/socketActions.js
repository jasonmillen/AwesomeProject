//import { ws } from '../api/server/socket';
import { IP, MESSAGE_TYPE } from '../../config';

import * as trackAPI from '../api/spotify/track';

export let ws = null;

export const REGISTER_USER = 'REGISTER_USER';
export const registerUser = () => {
  return {
    type: REGISTER_USER,
    payload: {}
  };
};


export const SOCKET_SEND_SONG = 'SOCKET_SEND_SONG';
export const socketSendSong = (message) => {
  return {
    type: SOCKET_SEND_SONG,
    payload: {
      message
    }
  };
}

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
          dispatch(socketSendSong(payload.message));
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
  }

  ws.send(JSON.stringify(payload));
};