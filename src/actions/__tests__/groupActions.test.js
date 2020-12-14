import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as groupActions from '../groupActions';
import * as token from '../../api/spotify/token';
import * as serverAPI from '../../api/server/server';
import * as sockAPI from '../../actions/socketActions';
import * as playlistAPI from '../../api/spotify/playlist';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let tokenMock, serverApiMock, sockApiMock, playlistApiMock;
let mockedModules = null;

const setMocks = () => {
  mockedModules = {
    tokenMock: {
      verifyTokenData: jest.spyOn(token, "verifyTokenData")
    },
    serverApiMock: {
      createGroup: jest.spyOn(serverAPI, "createGroup")
    },
    sockApiMock: {
      createGroup: jest.spyOn(sockAPI, "createGroup")
    },
    playlistApiMock: {
      createPlaylist: jest.spyOn(playlistAPI, "createPlaylist")
    }
  }
};

const restoreMocks = () => {
  Object.values(mockedModules).forEach(mockedModule => {
    Object.values(mockedModule).forEach(mockedMethod => mockedMethod.mockRestore());
  });
};


describe('groupActions', () => {

  beforeEach(() => {
    fetch.resetMocks();
    setMocks();
  });

  afterEach(() => {
    restoreMocks();
  });

  it('should work', async () => {

    mockedModules = {
      ...mockedModules,
      groupActionsMock: {
        fetchUserGetGroups: jest.spyOn(groupActions, "fetchUserGetGroups")
      }
    };

    const { tokenMock, serverApiMock, sockApiMock, playlistApiMock, groupActionsMock } = mockedModules; 

    const testGroup = {
      id: 1,
      name: 'test group'
    };

    const createPlaylistResponse = {
      id: "playlistid"
    };

    const fetchUserGetGroupsResponse = {
      type: "TEST_RESPONSE"
    };

    tokenMock.verifyTokenData.mockResolvedValue(false);
    playlistApiMock.createPlaylist.mockResolvedValue(JSON.stringify(createPlaylistResponse));
    serverApiMock.createGroup.mockResolvedValue(JSON.stringify(testGroup));
    sockApiMock.createGroup.mockReturnValue(null);
    groupActionsMock.fetchUserGetGroups.mockReturnValue(fetchUserGetGroupsResponse);

    const store = mockStore({});

    const creatorID = 1;
    const creatorSpotifyID = "test";
    const memberSpotifyIds = ["test2"];
    const playlistName = "playlist name";
    const tokenData = { token: "test data" };
    await store.dispatch(groupActions.fetchCreateGroup(
      creatorID, creatorSpotifyID, memberSpotifyIds, playlistName, tokenData));

    const actions = store.getActions();
    expect(actions.length).toBe(3);
    expect(actions[0].type).toBe(groupActions.GROUP_CREATE_REQUEST);
    expect(actions[1].type).toBe(groupActions.GROUP_CREATE_SUCCESS);
    expect(actions[2].type).toBe(fetchUserGetGroupsResponse.type);
  });



});
