import colorsys from 'colorsys';
import React from 'react';
import { ImageBackground, View } from 'react-native';
import { Picker, PickerProps } from './Picker';
import type { Point } from './Point';
import { styles } from './styles';
import { Thumb } from './Thumb';

export class RGBPicker extends Picker<string> {
  public static defaultProps: PickerProps<string> = {
    value: '#FFFFFF',
  };

  protected fromValue(value: string): Point {
    const { radius } = this.state;
    const { h, s } = colorsys.hex2Hsv(value);
    const rad = (h / 180) * Math.PI;
    const d = (s / 100) * radius;
    return this.getThumbCoordinate(rad, d);
  }

  protected toValue(rad: number, d: number): string {
    const { radius } = this.state;
    const h = (rad * 180) / Math.PI;
    const s = Math.min(d / radius, 1) * 100;
    const v = 100;
    return colorsys.hsv2Hex({ h, s, v });
  }

  protected getThumbColor() {
    return this.props.value;
  }

  public render() {
    const { radius } = this.state;

    return (
      <View style={[styles.container]}>
        <ImageBackground
          style={[
            styles.image,
            {
              width: radius * 2,
            },
          ]}
          source={require('./images/color-wheel.png')}
          resizeMode="contain"
        >
          <Thumb
            {...this.panResponder.panHandlers}
            style={this.getLayout()}
            color={this.state.thumbColor || this.getThumbColor()}
          />
        </ImageBackground>
      </View>
    );
  }
}
