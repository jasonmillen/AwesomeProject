import React from 'react';
import renderer from 'react-test-renderer';

import ListItem from '../ListItem';


describe('<ListItem />', () => {

  it('renders', () => {

    const item = {
      id: 1,
      title: "test title",
      artist: "test artist",
      album: "test album",
      imageUri: "testImageUri"
    };
    const onPress = () => console.log('onPress');
    const onLongPress = () => console.log('onLongPress');

    const tree = renderer.create(
      <ListItem 
        item={item}
        onPress={onPress}
        onLongPress={onLongPress}
      />).toJSON();
      
    const children = tree.children;

    const trackImage = children[0];
    expect(trackImage.type).toBe('Image');
    expect(trackImage.props.source.uri).toBe(item.imageUri);

    const songInfo = children[1];
    expect(songInfo.children.length).toBe(2);
    const songTitle = songInfo.children[0];
    expect(songTitle.children[0]).toBe(item.title);
    const songArtist = songInfo.children[1];
    expect(songArtist.children[0]).toBe(item.artist);
  });
});