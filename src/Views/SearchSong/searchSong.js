import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
// import { NavigationEvents /*NavigationActions*/ } from 'react-navigation';
// import { HeaderBackButton } from 'react-navigation-stack';
import { Linking } from 'expo';

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

import search from '../../api/spotify/search';

import {
  selectUserID,
  selectTokenData
} from '../../reducers/userReducer';
import AddSongToGroupModal from '../../Components/AddSongToGroupModal';

import * as socketAPI from '../../actions/socketActions';

const PAGE = 20;

class SearchSong extends React.Component {

  // static navigationOptions = ({ navigation }) => {

  //   // const group = navigation.getParam('group');
  //   // const userID = navigation.getParam('userID');

  //   // const handleBackButtonPress = () => {
  //   //   console.log('CUSTOM BACK BUTTON', group.id, userID);
  //   //   navigation.dispatch(NavigationActions.back());
  //   // };

  //   return {
  //     title: 'Search For Song',
  //     // headerLeft: <HeaderBackButton onPress={handleBackButtonPress} />
  //   };
  // };

  constructor(props) {
    super(props);

    // props.navigation.setParams({
    //   userID: this.props.userID
    // });

    // const group = props.navigation.getParam('group');
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
      startedSearching: false
    };
  }

  async componentDidMount() {
    //await this.loadNextPage();

    this._unsubscribe = this.props.navigation.addListener('blur', () => {
      console.log("HANDLING BLURR EVENT!!");
      this.handleComponentWillBlur();
    });
  }

  async componentWillUnmount() {
    this._unsubscribe();
  }

  async loadNextPage() {
    const { songs, offset, query, isFetching, isEmpty } = this.state;

    if (isFetching || isEmpty) {
      return;
    }

    this.setState({ isFetching: true });

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
      songs: [...songs, ...newSongs],
      offset: offset + PAGE
    });
  }

  handleSearchChange(text) {

    if (!this.state.startedSearching && this.props.userID && this.state.isForGroupID) {
      socketAPI.searchSongStart(this.props.userID, this.state.isForGroupID);
    }

    this.setState({
      isEmpty: false,
      query: text,
      offset: 0,
      songs: [],
      startedSearching: true
    }, () => {
      this.loadNextPage();
    });

    console.log('search text is', text);
  }

  async handleEndReached() {
    await this.loadNextPage();
  }

  handleListItemPress (songID, songTitle) {
    console.log('PRESSED: ', songID, songTitle);
    try {
      Linking.openURL(`spotify:track:${songID}`);
    }
    catch (error) {
      console.log('Error: ', error);
    }
    // if (Linking.canOpenUrl(`spotify:track:${songID}`)) {
    //   console.log('CAN OPEN');
    // }
    // else {
    //   console.log('CANNOT OPEN');
    // }
  }

  handleListItemLongPress (songID) {
    console.log("LONG PRESS");
    this.setState({ 
      selectedSongID: songID,
      addSongToGroupModalView: true 
    });
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

    this.props.groupAddSong(groupID, playlistID, songID, userID);
  }

  handleComponentWillBlur () {
    console.log("HANDLING COMPONENT BLURRING!!!!");
    if (this.props.userID && this.state.isForGroupID) {
      socketAPI.searchSongStop(this.props.userID, this.state.isForGroupID);
    }
  }

  render() {

    const { songs, query, isFetching } = this.state;

    return (
      <View style={styles.container}>
        {/* <NavigationEvents
          onDidFocus={() => console.log('FOCUS111111')}
          onWillFocus={() => console.log("FOCUS222222")}
          onDidBlur={() => console.log("BLUR11111111")}
          onWillBlur={() => this.handleComponentWillBlur()}
        /> */}
        <Search 
          onChange={text => this.handleSearchChange(text)}
          text={query}
        />
        {
          (isFetching && songs.length === 0)
          ? <ActivityIndicator />
          : <Listing
              items={songs}
              onEndReached={() => this.handleEndReached()}
              onItemPress={(id, title) => this.handleListItemPress(id, title)}
              onItemLongPress={(id) => this.handleListItemLongPress(id)}
            />
        }
        <AddSongToGroupModal
          style={styles.modal}
          group={this.state.isForGroup}
          visible={this.state.addSongToGroupModalView}
          onOK={() => this.onAddSongToGroupModalOK()}
          onCancel={() => this.onAddSongToGroupModalCancel()}
        />
      </View>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    tokenData: selectTokenData(state),
    userID: selectUserID(state)
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    margin: 10,
    marginTop: 10
  },
  modal: {
    flex: 1,
    width: 200,
    height: 200,
    marginTop: 300,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchSong);