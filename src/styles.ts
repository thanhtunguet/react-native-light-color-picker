import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('screen');

const screenSize = Math.min(width, height);

export const styles = StyleSheet.create({
  container: {
    width: screenSize,
    height: screenSize,
    alignSelf: 'flex-start',
  },
  image: {
    width: '100%',
    zIndex: 0,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  thumb: {
    width: 52,
    height: 48,
    position: 'absolute',
    zIndex: 1,
  },
});
