import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    opacity: 0,
    justifyContent: 'center',
    zIndex: 0,
  },
  wheelContainer: {
    alignSelf: 'center',
  },
  wheel: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  thumb: {
    position: 'absolute',
  },
});
