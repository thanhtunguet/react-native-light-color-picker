import * as React from 'react';

import { StyleSheet, View } from 'react-native';
import LightColorPicker from 'react-native-light-color-picker';

export default function App() {
  const [color, setColor] = React.useState<string>('#FF0000');

  return (
    <View style={styles.container}>
      <LightColorPicker color={color} onColorChange={setColor} />
      <View
        style={[
          styles.demo,
          {
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  demo: {
    width: '100%',
    height: 80,
    marginTop: 20,
    zIndex: 0,
  },
});
