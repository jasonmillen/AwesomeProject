//import { ws } from '../api/server/socket';
import { IP, MESSAGE_TYPE } from '../../config';

export let ws = null;

export const REGISTER_USER = 'REGISTER_USER';
export const registerUser = () => {
  return {
    type: REGISTER_USER,
    payload: {}
  };
};

export const initSocket = (userID) => {
  return async (dispatch) => {
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

      if (payload.type == MESSAGE_TYPE.REGISTER_USER) {
        dispatch(registerUser());
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