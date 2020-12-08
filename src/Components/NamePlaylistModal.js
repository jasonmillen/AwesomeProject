import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableHighlight
} from 'react-native';

import { LIGHT_GREEN, GREY_GREEN, DARK_GREEN } from '../constants/colors';

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
          <View style={styles.modalContent}>
            <Text style={styles.startChatText}>Start Chat</Text>
            <View style={styles.playlistNameInputView}>
              <TextInput 
                style={styles.playlistNameInput}
                onChangeText={text => this.setState({ playlistName: text })}
                placeholder='Playlist name'
              />
            </View>
          </View>
          <View style={styles.buttonView}>
            <TouchableHighlight 
              style={styles.cancelButton}
              onPress={this.props.onCancel}
              underlayColor='grey'
              //activeOpacity={.99}
            >
              <Text>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight 
              style={styles.okButton}
              onPress={() => this.props.onOK(this.state.playlistName)}
              underlayColor={DARK_GREEN}
            >
              <Text style={styles.okButtonText}>Ok</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    );
  }

};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#ffffff', 
    marginTop: 25, 
    marginLeft: 25,
    marginRight: 25,
    padding: 20,
    flex: 0.15,
    //width: 200,
    //height: 500,
    justifyContent: 'space-between',
    //alignItems: 'center'
  },
  text: {
    fontSize: 20,
    color: 'blue'
  },
  playlistNameInput: {
    height: 40,
    marginLeft: 5
    //backgroundColor: GREY_GREEN
    //borderColor: 'gray',
    //borderWidth: 1
  },
  playlistNameInputView: {
    backgroundColor: GREY_GREEN
  },
  startChatText: {
    fontSize: 25,
    textAlign: 'center',
    color: DARK_GREEN
  },
  buttonView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 25,
    marginRight: 25
    //backgroundColor: 'grey'
  },
  cancelButton: {
    flex: 1,
    height: 40,
    backgroundColor: GREY_GREEN,
    alignItems: 'center',
    justifyContent: 'center'
  },
  okButton: {
    flex: 1,
    height: 40,
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center',
    justifyContent: 'center'
  },
  okButtonText: {
    color: 'white'
  }
});