import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  TextInput,
  View,
  Button,
  Image,
  StyleSheet
} from 'react-native';

import {
  fetchSearchUser
} from '../../actions/searchActions';

import {
  selectTokenData
} from '../../reducers/userReducer';

import {
  selectUserSearchState
} from '../../reducers/searchReducer';

class SearchUser extends React.Component {

  static navigationOptions = {
    title: 'Search For Users'
  };

  constructor (props) {
    super (props);

    this.state = {
      searchText: ''
    };
  }

  handleSearchUserClick () {
    console.log('clicked search');
    console.log(this.props.tokenData);
    this.props.fetchSearchUser(this.state.searchText, this.props.tokenData);
  }

  render () {
    let searchFeedback;
    let searchState = this.props.searchState;
    if (searchState.searchForUserError) {
      searchFeedback = (<Text>Error searching for user {searchState.userSearchStringID}</Text>);
    }
    else if (searchState.userSearchStringID && !searchState.isSearchingForUser && !searchState.userFound) {
      searchFeedback = (<Text>Could not find user: {searchState.userSearchStringID}</Text>);
    }
    else if (searchState.userSearchStringID && searchState.userFound) {
      userData = searchState.userData;
      searchFeedback = (
        <View>
          <Text>Found user: {searchState.userSearchStringID}</Text>
          {
            (userData && Array.isArray(userData.images) && userData.images.length > 0 && userData.images[0].url) && 
            <Image
              style={{width: 50, height: 50}}
              source={{uri: userData.images[0].url}}
            />
          }
        </View>
      );
    }
    else {
      searchFeedback = (<Text></Text>);
    }

    return (
      <View style={styles.searchUserPage}>
        <Text>
          Search User Page
        </Text>
        <TextInput 
          style={styles.searchUserTextInput} 
          onChangeText={text => this.setState({ searchText: text })}
        />
        <Button 
          title='Search'
          onPress={() => this.handleSearchUserClick()}
        />
        {searchFeedback}
      </View>
    )
  }

};

const mapStateToProps = (state) => {
  return {
    tokenData: selectTokenData(state),
    searchState: selectUserSearchState(state)
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSearchUser: (userID, tokenData) => {
      dispatch(fetchSearchUser(userID, tokenData));
    }
  };
};

const styles = StyleSheet.create({
  searchUserPage: {
    flex: 1,
    justifyContent: 'flex-start',
    //alignItems: 'center'
  },
  searchUserTextInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchUser);