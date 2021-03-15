import React, { FC, PropsWithChildren, ReactElement } from 'react';
import nameof from 'ts-nameof.macro';
import LightColorPicker from 'lib/LightColorPicker';
import { View } from 'react-native';
import { styles } from './styles';
import { Button } from 'react-native-paper';

/**
 * File: RgbDemo.tsx
 * @created 2021-03-15 21:31:22
 * @author Thanh Tùng <ht@thanhtunguet.info>
 * @type {FC<PropsWithChildren<RgbDemoProps>>}
 */
const RgbDemo: FC<PropsWithChildren<RgbDemoProps>> = (): ReactElement => {
  const [color, setColor] = React.useState<string>('#FF0000');

  return (
    <>
      <Button
        onPress={() => {
          setColor('#00FFFF');
        }}
      >
        Set value
      </Button>
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
    </>
  );
};

export interface RgbDemoProps {
  //
}

RgbDemo.defaultProps = {
  //
};

RgbDemo.propTypes = {
  //
};

RgbDemo.displayName = nameof(RgbDemo);

export default React.memo(RgbDemo);
