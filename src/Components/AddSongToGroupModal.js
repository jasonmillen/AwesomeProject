import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

import { GREY_GREEN, LIGHT_GREEN, DARK_GREEN } from '../constants/colors';

export default class AddSongToGroupModal extends Component {

  constructor (props) {
    super (props);
  }

  render () {

    const group = this.props.group;
    const track = this.props.track;
    const trackTitle = track ? track.title : '';
    const trackArtist = track ? track.artist : '';
    const trackImageUri = track ? track.imageUri : null;

    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
      >
        <View style={{backgroundColor: '#000000aa', flex: 1}}>
          <View style={styles.modalContent}>
            <Text style={styles.groupNameText}>{group ? group.playlistName : ''}</Text>
            <Text style={styles.confirmationText}>Are you sure you want to add this track?</Text>
            <View style={styles.trackInfoView}>
              {trackImageUri && <Image source={{ uri: trackImageUri }} style={styles.image}/>} 
              <View style={styles.trackInfoTextView}>
                <Text numberOfLines={1} style={styles.trackTitleText}>{trackTitle}</Text>
                <Text numberOfLines={1} style={styles.trackArtistText}>{trackArtist}</Text>
              </View>
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
                style={styles.confirmButton}
                onPress={this.props.onOK}
                underlayColor={DARK_GREEN}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
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
    marginLeft: 25,
    marginRight: 25,
    marginTop: 25,
    padding: 20,
    flex: 0.25,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  // modal: {
  //   flex: 1,
  //   width: 200,
  //   height: 200,
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },
  confirmationText: {
    textAlign: 'center'
  },
  groupNameText: {
    fontSize: 25,
    textAlign: 'center'
  },
  trackInfoView: {
    flexDirection: 'row',
    marginTop: 5
  },
  trackInfoTextView: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 50
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 15
  },
  trackTitleText: {
    fontWeight: 'bold',
    color: DARK_GREEN
  },
  trackArtistText: {
    //color: 'grey'
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
  confirmButton: {
    flex: 1,
    height: 40,
    backgroundColor: LIGHT_GREEN,
    alignItems: 'center',
    justifyContent: 'center'
  },
  confirmButtonText: {
    color: 'white'
  }
})