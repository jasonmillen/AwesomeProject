import {
  SET_USER_TOKEN_SUCCESS
} from '../actions/tokenActions';

const initialState = {
  accessToken: null,
  expirationTime: null,
  refreshToken: null
};

export default tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_TOKEN_SUCCESS:
      console.log('set user token reducer');
      return {
        ...state,
        accessToken: action.payload.accessToken,
        expirationTime: action.payload.expirationTime,
        refreshToken: action.payload.refreshToken
      };
    default:
      return state;
  }
};