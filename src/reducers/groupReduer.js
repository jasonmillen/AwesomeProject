import {
  GROUP_CREATE_REQUEST,
  GROUP_CREATE_ERROR,
  GROUP_CREATE_SUCCESS
} from '../actions/groupActions';

const initialState = {

};

export default groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case GROUP_CREATE_REQUEST: {
      console.log(GROUP_CREATE_REQUEST);
      return state;
    }
    case GROUP_CREATE_ERROR: {
      console.log(GROUP_CREATE_ERROR);
      return state;
    }
    case GROUP_CREATE_SUCCESS: {
      console.log(GROUP_CREATE_SUCCESS);
      return state;
    }
    default:
      return state;
  }
};
