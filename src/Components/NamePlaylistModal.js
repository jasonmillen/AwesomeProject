import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal
} from 'react-native';

export default class NamePlaylistModal extends Component {

  constructor (props) {
    super (props);
    
    this.state = { playlistName: '' };
  }

  componentDidUpdate (prevProps) {
    if (this.props.visible && !prevProps.visible) {
      this.setState({ playlistName: '' });
    }
  }

  render () {
    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
      >
        <View style={{backgroundColor: '#000000aa', flex: 1}}>
          <View style={{backgroundColor: '#ffffff', margin: 25, padding: 20}}>
            <TextInput 
              style={styles.playlistNameInput}
              onChangeText={text => this.setState({ playlistName: text })}
              placeholder='Playlist name'
            />
            <Button 
              title='Close' 
              style={{ margin: 5}} 
              onPress={this.props.onCancel} />
            <Button 
              title='Ok' 
              style={{ margin: 5 }} 
              onPress={() => this.props.onOK(this.state.playlistName)}/>
          </View>
        </View>
      </Modal>
    );
  }

};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    color: 'blue'
  },
  playlistNameInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  },
});