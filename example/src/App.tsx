import React from 'react';
import { Text } from 'react-native';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  calcTextColor,
  CCTPicker,
  RGBPicker,
} from 'react-native-light-color-picker';
import { Button } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('screen');

export default function App() {
  const [color, setColor] = React.useState<string>('#FFFF00');

  const [value, setValue] = React.useState<number>(0);

  const [mode, setMode] = React.useState<number>(1);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.SafeAreaView}>
        <View>
          <Button
            onPress={() => {
              setMode(mode === 0 ? 1 : 0);
            }}
          >
            Switch mode
          </Button>
        </View>
        {mode === 0 && (
          <>
            <RGBPicker
              value={color}
              onChangeComplete={console.log}
              onChange={setColor}
            />
            <View
              style={[
                styles.demo,
                {
                  backgroundColor: color,
                },
              ]}
            >
              <Button
                labelStyle={{
                  color: calcTextColor(color),
                }}
                onPress={() => {
                  setColor('#FF0000');
                }}
              >
                Set color
              </Button>
            </View>
          </>
        )}
        {mode === 1 && (
          <>
            <CCTPicker
              value={value}
              onChangeComplete={console.log}
              onChange={setValue}
            />
            <View
              style={[
                styles.demo,
                {
                  backgroundColor: color,
                },
              ]}
            >
              <Button
                labelStyle={{
                  color: calcTextColor(color),
                }}
                onPress={() => {
                  setValue(30);
                }}
              >
                Set value
              </Button>
              <Text style={styles.text}>{value}</Text>
            </View>
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  SafeAreaView: {
    width,
    height,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  demo: {
    width: '100%',
    height: 100,
  },
  text: {
    alignSelf: 'center',
  },
});
