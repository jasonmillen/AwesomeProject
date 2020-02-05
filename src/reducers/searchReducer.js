import {
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_ERROR
} from '../actions/searchActions';

const initialState = {
  userSearchStringID: '',
  userData: null,
  userFound: null,
  isSearchingForUser: null,
  searchForUserError: null
};

export default searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_USER_REQUEST:
      console.log(SEARCH_USER_REQUEST);
      return {
        ...state,
        userSearchStringID: action.payload.spotifyUserID,
        userData: null,
        userFound: false,
        isSearchingForUser: true,
        searchForUserError: false
      };
    case SEARCH_USER_SUCCESS:
      console.log(SEARCH_USER_SUCCESS);
      userData = action.payload.userData;
      return {
        ...state,
        userData: userData,
        userFound: !!userData,
        isSearchingForUser: false,
        searchForUserError: false
      };
    case SEARCH_USER_ERROR:
      console.log(SEARCH_USER_ERROR);
      return {
        ...state,
        userData: null,
        userFound: false,
        isSearchingForUser: false,
        searchForUserError: true

      }
    default:
      return state;
  }
};

export const selectUserSearchState = (state) => {
  const searchState = state.search;
  return {
    userSearchStringID: searchState.userSearchStringID,
    userData: searchState.userData,
    userFound: searchState.userFound,
    isSearchingForUser: searchState.isSearchingForUser,
    searchForUserError: searchState.searchForUserError
  };
} 