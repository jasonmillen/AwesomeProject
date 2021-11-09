import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import * as Linking from 'expo-linking';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import {
  setUserTokensSuccess
} from '../../actions/tokenActions';
import {
  fetchGroupAddSong
} from '../../actions/groupActions';
import {
  verifyTokenData
} from '../../api/spotify/token';
 
import Search from '../../Components/Search';
import Listing from '../../Components/Listing';
import Separator from '../../Components/Separator';

import search, { debouncedSearch } from '../../api/spotify/search';

import {
  selectUserID,
  selectTokenData,
  selectDefaultRecommendedTracks
} from '../../reducers/userReducer';
import AddSongToGroupModal from '../../Components/AddSongToGroupModal';

import * as socketAPI from '../../actions/socketActions';

import { debounce } from '../../utility/util';
import { DARK_GREEN, GREY_GREEN } from '../../constants/colors';

const PAGE = 20;
const SEND_SEARCHING_FOR_SONG_THROTTLE_TIME = 1.5 * 1000; // 1.5 seconds

class SearchSong extends React.Component {

  constructor(props) {
    super(props);

    const group = props.route.params?.group ?? null;

    this.state = {
      songs: [],
      offset: 0,
      query: '',
      isFetching: false,
      isEmpty: false,
      isForGroupID: group && group.id ? group.id : null,
      isForGroup: group,
      addSongToGroupModalView: false,
      selectedSongID: null,
      startedSearching: false,
      startedFetching: false,
      startedScrolling: false,
      canSendSearchingForSong: true,
      resetCanSendSearchingForSongTimeoutId: null,
    };

    this.debouncedLoadNextPage = debounce(async () => {
      await this.loadNextPage(false);
    }, 250);
  }

  async componentDidMount() {
    //await this.loadNextPage();

    this._unsubscribe = this.props.navigation.addListener('blur', () => {
      this.handleComponentWillBlur();
    });
  }

  async componentWillUnmount() {
    if(this.state.resetCanSendSearchingForSongTimeoutId) {
      clearTimeout(this.state.resetCanSendSearchingForSongTimeoutId);
    }
    this._unsubscribe();
  }

  async loadNextPage(append) {
    const { songs, offset, query, isFetching, isEmpty, startedSearching } = this.state;

    if (isEmpty || !startedSearching) {
      return;
    }

    this.setState({ isFetching: true, startedFetching: query.trim().length > 0 ? true : false });

    const tokenData = this.props.tokenData;
    if (await verifyTokenData(tokenData)) {
      this.props.setUserTokensSuccess(tokenData);
    }

    const newSongs = await search({
      offset,
      limit: PAGE,
      q: query,
      token: tokenData.accessToken
    });

    if (newSongs.length === 0) {
      console.log('No songs found. There may be an error.');
      this.setState({ isEmpty: true });
    }

    this.setState({
      isFetching: false,
      songs: append ? [...songs, ...newSongs] : newSongs,
      offset: offset + PAGE
    });
  }

  handleSearchChange(text) {

    this.handleSendSearchingForSong();

    this.setState({
      isEmpty: false,
      query: text,
      offset: 0,
      startedSearching: true
    }, () => {
      this.debouncedLoadNextPage();
    });

    console.log('search text is', text);
  }

  async handleEndReached() {
    console.log('ENDING HAS BEEN REACHED!!!!!');
    await this.loadNextPage(true);
  }

  openTrackInSpotify (songID, songTitle) {
    console.log('PRESSED: ', songID, songTitle);
    try {
      Linking.openURL(`spotify:track:${songID}`);
    }
    catch (error) {
      console.log('Error: ', error);
    }
  }

  openModalToConfirmSharingSong (track) {
    this.setState({ 
      selectedSongID: track.id,
      selectedTrack: track,
      addSongToGroupModalView: true 
    });
  }


  handleListItemPress (track) {
    this.openModalToConfirmSharingSong(track);
    this.handleSendSearchingForSong();
  }

  handleListItemLongPress (songID) {
    console.log("LONG PRESS");
  }

  onAddSongToGroupModalCancel () {
    this.setState({ addSongToGroupModalView: false });
  }

  onAddSongToGroupModalOK () {
    this.setState({ addSongToGroupModalView: false });

    const groupID = this.state.isForGroupID;
    const playlistID = this.state.isForGroup.playlistID;
    const songID = this.state.selectedSongID;
    const userID = this.props.userID;
    if (!groupID || !songID || !userID) {
      console.error(`Missing data - groupID: ${groupID}, playlistID: ${playlistID}, songID: ${songID}, userID: ${userID}`);
      return;
    }

    if (this.props.userID && this.state.isForGroupID) {
      socketAPI.searchSongStop(this.props.userID, this.state.isForGroupID);
    }

    this.props.groupAddSong(groupID, playlistID, songID, userID);
  }

  handleComponentWillBlur () {
    console.log("HANDLING COMPONENT BLURRING!!!!");
    if (this.props.userID && this.state.isForGroupID) {
      socketAPI.searchSongStop(this.props.userID, this.state.isForGroupID);
    }
  }

  handleOnListScroll() {
    this.setState({ startedScrolling: true });
    this.handleSendSearchingForSong();
  }

  handleSendSearchingForSong() {
    if (this.state.canSendSearchingForSong && this.props.userID && this.state.isForGroupID) {
      socketAPI.searchSongStart(this.props.userID, this.state.isForGroupID);
      this.setState({ canSendSearchingForSong: false });
      let timeoutId =
        setTimeout(() => this.setState({ canSendSearchingForSong: true }), SEND_SEARCHING_FOR_SONG_THROTTLE_TIME);
      this.setState({ resetCanSendSearchingForSongTimeoutId: timeoutId });
    }
  }

  render() {

    const theme = this.props.route.params.theme;
    const _styles = getStyles(theme);

    const { songs, query, isFetching, startedSearching, startedFetching, startedScrolling } = this.state;

    const showActivityIndicator = isFetching && songs.length === 0;
    const showDefaultRecommendedTracks = startedSearching === false || (query.trim().length === 0 && !showActivityIndicator);
    const showNoResults = songs.length === 0 && !isFetching && startedFetching && !showActivityIndicator && !showDefaultRecommendedTracks;

    return (
      <SafeAreaView style={styles.container}>
        <View style={_styles.titleBar}>
          <TouchableOpacity
            style={styles.titleBarBackButton}
            onPress={() => this.props.navigation.goBack()}>
            <Ionicons color='grey' name='ios-arrow-back' size={30} />
          </TouchableOpacity>
          <Search onChange={text => this.handleSearchChange(text)}/>
        </View>
        <View style={styles.listingView}>
          {showActivityIndicator && <ActivityIndicator />}
          {showNoResults && <Text>No Results</Text>}
          {!showActivityIndicator && !showNoResults &&
            <Listing
              items={showDefaultRecommendedTracks ? this.props.defaultRecommendedTracks : songs}
              onEndReached={() => this.handleEndReached()}
              onItemPress={(id, title) => this.handleListItemPress(id, title)}
              onItemLongPress={(id) => this.handleListItemLongPress(id)}
              onScroll={() => this.handleOnListScroll()}
            />
          }

          <AddSongToGroupModal
            style={styles.modal}
            group={this.state.isForGroup}
            track={this.state.selectedTrack}
            visible={this.state.addSongToGroupModalView}
            onOK={() => this.onAddSongToGroupModalOK()}
            onCancel={() => this.onAddSongToGroupModalCancel()}
          />
        </View>
      </SafeAreaView>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    tokenData: selectTokenData(state),
    userID: selectUserID(state),
    defaultRecommendedTracks: selectDefaultRecommendedTracks(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserTokensSuccess: (tokenData) => {
      dispatch(setUserTokensSuccess(tokenData));
    },
    groupAddSong: (groupID, playlistID, trackID, senderID) => {
      dispatch(fetchGroupAddSong(groupID, playlistID, trackID, senderID));
    }
  };
};

const getStyles = (theme) => {
  return {
    titleBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.textInputBackground,
    },
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
    // alignItems: 'stretch',
    // justifyContent: 'flex-start',
  },
  modal: {
    flex: 1,
    width: 200,
    height: 200,
    marginTop: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
  recommendedText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: DARK_GREEN,
    margin: 10
  },
  // titleBar: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: GREY_GREEN
  // },
  titleBarBackButton: {
    width: 25,
    margin: 10,
    alignItems: 'center'
  },
  listingView: {
    flex: 1
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchSong);

// function SearchSong(props) {
//   const theme = useTheme();

//   return <SearchSongClass {...props} theme={theme} />;
// };

// export default connect(mapStateToProps, mapDispatchToProps)(SearchSong);