import { Dimensions, StyleSheet } from 'react-native';
import { THUMB_HEIGHT, THUMB_WIDTH } from './config';

const { width, height } = Dimensions.get('screen');

const screenSize = Math.min(width, height);

export const styles = StyleSheet.create({
  container: {
    width: screenSize,
    alignSelf: 'flex-start',
  },
  image: {
    width: '100%',
    zIndex: 0,
    aspectRatio: 1,
    marginTop: THUMB_HEIGHT,
    marginHorizontal: THUMB_WIDTH / 2,
  },
  thumb: {
    width: 52,
    height: 48,
    position: 'absolute',
    zIndex: 1,
    marginTop: THUMB_HEIGHT,
    marginHorizontal: THUMB_WIDTH / 2,
  },
});
