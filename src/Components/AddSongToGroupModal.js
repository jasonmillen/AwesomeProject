import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  Modal
} from 'react-native';

export default class AddSongToGroupModal extends Component {

  constructor (props) {
    super (props);
  }

  render () {

    const group = this.props.group;

    return (
      <Modal
        visible={this.props.visible}
        transparent={true}
      >
        <View style={{backgroundColor: '#000000aa', flex: 1}}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to add this song to group: {group ? group.playlistName : ''}</Text>
            <Button 
              title='Cancel' 
              style={{ margin: 5, marginTop: 10 }} 
              onPress={this.props.onCancel} />
            <Button 
              title='Ok' 
              style={{ margin: 5, marginTop: 10 }} 
              onPress={this.props.onOK}/>
          </View>
        </View>
      </Modal>
    );
  }

};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#ffffff',
    margin: 25,
    padding: 20,
    flex: 0.25,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
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