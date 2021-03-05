import React, { Component, PropsWithChildren } from 'react';
import {
  Animated,
  Image,
  LayoutChangeEvent,
  PanResponder,
  PanResponderInstance,
  StyleSheet,
  ViewProps,
} from 'react-native';
import { styles } from './LightColorPicker.styles';
import type { LightColorPickerProps } from 'lib/LightColorPickerProps';
import type { LightColorPickerState } from 'lib/LightColorPickerState';
import type { Point } from 'lib/Point';
import colorsys from 'colorsys';
import PropTypes from 'prop-types';

/**
 * File: LightColorPicker.tsx
 * @created 2021-03-03 08:42:49
 * @author Thanh Tùng <ht@thanhtunguet.info>
 */
export default class LightColorPicker extends Component<
  PropsWithChildren<LightColorPickerProps>,
  LightColorPickerState
> {
  public static readonly defaultProps: LightColorPickerProps = {
    color: '#FFFFFF',
  };

  public static readonly propTypes = {
    color: PropTypes.string,
    onColorChange: PropTypes.func,
    onColorChangeCompleted: PropTypes.func,
  };

  constructor(props: LightColorPickerProps) {
    super(props);
    const { color } = props;
    this.state = {
      radius: 0,
      isCalculated: false,
      center: {
        x: 0,
        y: 0,
      },
      animatedValue: new Animated.ValueXY({
        x: 0,
        y: 0,
      }),
      animatedLayout: new Animated.ValueXY({
        x: 0,
        y: 0,
      }),
      containerLayout: {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      },
      thumbLayout: {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      },
      color,
    };
    this.state.animatedValue.addListener(this.handleSyncLayout);
  }

  private readonly panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      this.state.animatedValue.extractOffset();
    },
    onPanResponderMove: (event, state) => {
      Animated.event(
        [
          null,
          { dx: this.state.animatedValue.x, dy: this.state.animatedValue.y },
        ],
        {
          useNativeDriver: false,
        }
      )(event, state);
    },
    onPanResponderRelease: () => {
      this.state.animatedValue.flattenOffset();
    },
  });

  public state: LightColorPickerState;

  public readonly getWidthOffset = () => {
    return this.state.thumbLayout.width / 2 + 1;
  };

  public readonly getHeightOffset = () => {
    return this.state.thumbLayout.height;
  };

  private readonly handleUpdateColor = (x: number, y: number) => {
    const { center, radius } = this.state;
    const dx = x - center.x;
    const dy = y - center.y;
    const deg = Math.atan2(dy, dx) * (-180 / Math.PI);
    const r = Math.min(Math.sqrt(dx * dx + dy * dy), radius);
    const hsv = {
      h: deg,
      s: (100 * r) / radius,
      v: 100,
    };
    return colorsys.hsv2Hex(hsv);
  };

  private readonly calculateWheelSize = () => {
    const {
      containerLayout,
      thumbLayout,
      isCalculated,
      animatedValue,
      animatedLayout,
    } = this.state;
    if (containerLayout.width > 0 && thumbLayout.width > 0 && !isCalculated) {
      const radius: number = (containerLayout.width - thumbLayout.width) / 2;
      const center: Point = {
        x: radius,
        y: radius,
      };
      const { color } = this.props;
      if (typeof color === 'string') {
        if (color.match(/^#([a-zA-Z0-9]{6})$/)) {
          const { h: deg, s } = colorsys.hex2Hsv(color);
          const rad = (Math.PI * deg) / 180;
          const d = (s * radius) / 100;
          const x = radius + d * Math.cos(rad);
          const y = radius - d * Math.sin(rad);
          const currentV: Point = {
            x,
            y,
          };
          animatedLayout.setValue(currentV);
          animatedValue.setValue(currentV);
        }
      } else {
        animatedLayout.setValue(center);
        animatedValue.setValue(center);
      }
      this.setState(
        {
          radius,
          center,
          isCalculated: true,
        },
        () => {
          animatedLayout.addListener(({ x, y }) => {
            const hexColor: string = this.handleUpdateColor(x, y);
            const { onColorChange } = this.props;
            if (typeof onColorChange === 'function') {
              onColorChange(hexColor);
            }
          });
        }
      );
    }
  };

  public readonly handleContainerLayoutChange: ViewProps['onLayout'] = (
    event: LayoutChangeEvent
  ) => {
    const { layout } = event.nativeEvent;
    this.setState(
      {
        containerLayout: layout,
      },
      () => {
        this.calculateWheelSize();
      }
    );
  };

  public readonly handleThumbLayoutChange: ViewProps['onLayout'] = (
    event: LayoutChangeEvent
  ) => {
    const { layout } = event.nativeEvent;
    this.setState(
      {
        thumbLayout: layout,
      },
      () => {
        this.calculateWheelSize();
      }
    );
  };

  public readonly handleSyncLayout = ({
    x: xb,
    y: yb,
  }: {
    x: number;
    y: number;
  }) => {
    const {
      center: { x: xa, y: ya },
      radius: R,
      isCalculated,
    } = this.state;

    if (isCalculated) {
      let x: number = xb,
        y: number = yb;

      const dx = xb - xa;
      const dy = yb - ya;

      const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

      if (d > R && d > 0) {
        x = xa + (R * dx) / d;
        y = ya + (R * dy) / d;
        if (Number.isNaN(x) || Number.isNaN(y)) {
          return;
        }
      }

      this.state.animatedLayout.setValue({
        x,
        y,
      });
    }
  };

  public readonly getLayout = () => {
    const {
      animatedLayout: { x, y },
    } = this.state;
    return {
      left: Animated.subtract(x, this.getWidthOffset()),
      top: Animated.subtract(y, this.getHeightOffset()),
    };
  };

  public readonly render = () => {
    const { radius, isCalculated } = this.state;

    const { children, thumbStyle } = this.props;

    const wheelSize: number = radius * 2;

    const opacityStyle = {
      opacity: isCalculated ? 1 : 0,
    };

    return (
      <Animated.View
        style={[styles.container, opacityStyle]}
        onLayout={this.handleContainerLayoutChange}
      >
        <Animated.View
          style={[
            styles.wheelContainer,
            {
              width: wheelSize,
              height: wheelSize,
            },
          ]}
        >
          <Animated.Image
            style={[styles.wheel]}
            source={require('./color-wheel.png')}
          />
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[
              styles.thumb,
              StyleSheet.flatten(thumbStyle),
              this.getLayout(),
            ]}
            onLayout={this.handleThumbLayoutChange}
          >
            {children || <Image source={require('./thumb.png')} />}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  };
}
