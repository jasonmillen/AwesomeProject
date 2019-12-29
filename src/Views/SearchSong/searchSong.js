import React from 'react';
import { connect } from 'react-redux';

import {
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import {
  setUserTokensSuccess
} from '../../actions/tokenActions';

import {
  verifyTokenData
} from '../../api/spotify/util';
 
import Search from '../../Components/Search';
import Listing from '../../Components/Listing';

import token from '../../api/spotify/token';
import search from '../../api/spotify/search';

import {
  selectTokenData
} from '../../reducers/userReducer';

const PAGE = 20;

class SearchSong extends React.Component {

  static navigationOptions = {
    title: 'Search For Song'
  };
  
  constructor() {
    super();

    this.state = {
      songs: [],
      offset: 0,
      query: '',
      isFetching: false,
      isEmpty: false
    };
  }

  async componentDidMount() {
    //await this.loadNextPage();
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
    this.setState({
      isEmpty: false,
      query: text,
      offset: 0,
      songs: [],
    }, () => {
      this.loadNextPage();
    });

    console.log('search text is', text);
  }

  async handleEndReached() {
    await this.loadNextPage();
  }

  render() {
    const { songs, query, isFetching } = this.state;

    return (
      <View style={styles.container}>
        <Search 
          onChange={text => this.handleSearchChange(text)}
          text={query}
        />
        {
          (isFetching && songs.length === 0)
          ? <ActivityIndicator />
          : <Listing
            items={songs}
            onEndReached={() => this.handleEndReached()} />
        }
      </View>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    tokenData: selectTokenData(state)
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUserTokensSuccess: (tokenData) => {
      dispatch (setUserTokensSuccess(tokenData));
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchSong);