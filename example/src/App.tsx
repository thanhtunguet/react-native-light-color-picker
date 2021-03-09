import * as React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import LightColorPicker, {
  CctColorPicker,
} from 'react-native-light-color-picker';
import { Button } from 'react-native-paper';

export default function App() {
  const [color, setColor] = React.useState<string>('#FF0000');

  const [tab, setTab] = React.useState<boolean>(false);

  const [value, setValue] = React.useState<number>(30);

  const handleSwitchTab = React.useCallback(() => {
    setTab(!tab);
  }, [tab]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Button onPress={handleSwitchTab}>Switch</Button>
      {tab && (
        <View style={[styles.tab]}>
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
      )}
      {!tab && (
        <View style={[styles.tab]}>
          <CctColorPicker value={value} onValueChange={setValue} />
          <View style={[styles.demo]}>
            <Text>{value}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  tab: {
    width: '100%',
    flex: 1,
  },
});
