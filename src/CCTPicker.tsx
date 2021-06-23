import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker, PickerProps } from './Picker';
import type { Point } from './Point';
import { styles } from './styles';
import { Thumb } from './Thumb';

const MAX_CCT = 100;

export class CCTPicker extends Picker<number> {
  public static defaultProps: PickerProps<number> = {
    value: 0,
  };

  protected fromValue(value: number): Point {
    const { radius, center } = this.state;
    return {
      x: center.x,
      y: (Math.min(value, MAX_CCT) / MAX_CCT) * radius * 2,
    };
  }

  protected toValue(rad: number, d: number): number {
    const { radius } = this.state;
    const r = d > radius ? radius : d;
    const y = radius - r * Math.sin(rad);
    return (y / (radius * 2)) * MAX_CCT;
  }

  protected getThumbColor() {
    const { value } = this.props;
    if (value < 26.04) {
      return '#FCB800';
    }
    if (value < 52.08) {
      return '#FFFFFF';
    }
    if (value < 76.56) {
      return '#E2F2FB';
    }
    return '#92CFF1';
  }

  public render() {
    const { radius } = this.state;

    return (
      <View style={[styles.container]}>
        <View
          style={[
            styles.image,
            {
              width: radius * 2,
              borderRadius: radius,
            },
          ]}
        >
          <LinearGradient
            style={[
              cctStyles.linear,
              {
                borderRadius: radius,
              },
            ]}
            colors={['#FCB800', '#FDDB80', '#FFFFFF', '#E2F2FB', '#92CFF1']}
            locations={[0, 0.2604, 0.5208, 0.7656, 1]}
            useAngle={true}
            angle={180}
          />
        </View>

        <Thumb
          {...this.panResponder.panHandlers}
          style={[this.getLayout()]}
          color={this.state.thumbColor || this.getThumbColor()}
          defaultContrastColor="#000000"
        />
      </View>
    );
  }
}

const cctStyles = StyleSheet.create({
  linear: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 0,
  },
  thumb: {
    position: 'absolute',
    zIndex: 1,
  },
});
