# react-native-light-color-picker

Light color picker for React Native

## Installation

```sh
yarn add react-native-light-color-picker
```

## Usage

```js
import LightColorPicker from "react-native-light-color-picker";

// ...

export default function App() {
  const [color, setColor] = React.useState<string>('#FFFFFF');

  return (
    <View style={styles.container}>
      <LightColorPicker onColorChange={setColor} />
      <View
        style={[
          styles.demo,
          {
            backgroundColor: color,
            zIndex: 0,
          },
        ]}
      />
    </View>
  );
}

```

### Props

```ts
export interface LightColorPickerProps {
  color?: string;

  onColorChange?(color: string);

  onColorChangeCompleted?(color: string);
}
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
