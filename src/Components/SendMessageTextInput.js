import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform
} from 'react-native';
import { useTheme } from '@react-navigation/native';

class SendMessageTextInput extends Component {

  constructor({ text }) {
    super();

    this.state = {
      text: text || '',
      height: 42,
    };
  }

  updateSize(e, height) {
    // const os = Platform.OS === 'ios' ? 'IOS' : 'AND';
    // console.log(`updated size ${os}: ${height}`);
    // height = Math.max(42, height);
    // this.setState({
    //   height
    // });
  }

  render() {

    const { height } = this.state;
    const { theme } = this.props;

    const _styles = getStyles(theme);
    //_styles.input.height = height;

    // const os = Platform.OS === 'ios' ? 'IOS' : 'AND';
    // console.log(`height ${os}: ${height}`);

    return (
      <View style={styles.container}>
        <View style={styles.search}>
          <TextInput
            style={_styles.input} 
            value={this.props.text}
            placeholder=' Type something here!'
            placeholderTextColor={theme.colors.textInputPlaceholder}
            onChangeText={newText => this.props.onChange(newText)}
            multiline
            //numberOfLines={5}
            //textAlignVertical={'top'}
            //minHeight={40}
            //onContentSizeChange={(e) => this.updateSize(e, e.nativeEvent.contentSize.height)}
            />
        </View>
      </View>
    );
  }
};

const getStyles = (theme) => {
  return {
    input: {
      paddingTop: 10,
      paddingBottom: 10,
      //paddingVertical: 0,
      paddingLeft: 15,
      paddingRight: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.textInputBackground,
      maxHeight: 80,
      color: theme.colors.text,
      //textAlignVertical: 'top'
    }
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 2,
    flex: 1,
  },
  search: {
    //borderRadius: 20,
    //backgroundColor: 'yellow',
    //alignContent: 'center',
    //alignItems: 'center'
    //justifyContent: 'center'
  }
});

export default function(props) {
  const theme = useTheme();

  return <SendMessageTextInput {...props} theme={theme} />;
};