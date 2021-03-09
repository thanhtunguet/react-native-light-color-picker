import type { CctColorPickerProps } from 'lib/CctColorPickerProps';
import type { CctColorPickerState } from 'lib/CctColorPickerState';
import type { Point } from 'lib/Point';
import PropTypes from 'prop-types';
import React, { Component, PropsWithChildren } from 'react';
import {
  Animated,
  Image,
  LayoutChangeEvent,
  PanResponder,
  PanResponderInstance,
  StyleProp,
  StyleSheet,
  ViewProps,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './CctColorPicker.styles';

/**
 * File: CctColorPicker.tsx
 * @created 2021-03-03 08:42:49
 * @author Thanh Tùng <ht@thanhtunguet.info>
 */
export default class CctColorPicker extends Component<
  PropsWithChildren<CctColorPickerProps>,
  CctColorPickerState
> {
  public state: CctColorPickerState;

  public static readonly defaultProps: CctColorPickerProps = {
    value: 0,
  };

  public static readonly propTypes = {
    color: PropTypes.string,
    onColorChange: PropTypes.func,
    onColorChangeCompleted: PropTypes.func,
  };

  constructor(props: CctColorPickerProps) {
    super(props);
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
      colorRef: React.createRef<number>(),
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
      const { onValueChangeCompleted } = this.props;
      const { colorRef } = this.state;
      if (
        typeof onValueChangeCompleted === 'function' &&
        typeof colorRef.current === 'number'
      ) {
        onValueChangeCompleted(colorRef.current);
      }
      this.state.animatedValue.flattenOffset();
    },
  });

  private readonly getWidthOffset = () => {
    return this.state.thumbLayout.width / 2 + 1;
  };

  private readonly getHeightOffset = () => {
    return this.state.thumbLayout.height;
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
      const { value } = this.props;
      if (typeof value === 'number') {
        if (value >= 0 && value <= 1000) {
          const x = radius;
          const y = (value / 100) * radius * 2;
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
          animatedLayout.addListener(({ y }) => {
            const v: number = (y / (radius * 2)) * 100;
            const { colorRef } = this.state;
            colorRef.current = v;
            const { onValueChange } = this.props;
            if (typeof onValueChange === 'function') {
              onValueChange(v);
            }
          });
        }
      );
    }
  };

  private readonly handleContainerLayoutChange: ViewProps['onLayout'] = (
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

  private readonly handleThumbLayoutChange: ViewProps['onLayout'] = (
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

  private readonly handleSyncLayout = ({
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

      const dx: number = xb - xa;
      const dy: number = yb - ya;

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

  private readonly getLayout = () => {
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

    const opacityStyle: StyleProp<ViewStyle> = {
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
          <Animated.View style={[styles.wheel]}>
            <LinearGradient
              style={[
                styles.wheel,
                {
                  borderRadius: radius,
                },
              ]}
              colors={['#FCB800', '#FDDB80', '#FFFFFF', '#E2F2FB', '#92CFF1']}
              locations={[0, 0.2604, 0.5208, 0.7656, 1]}
              useAngle={true}
              angle={180}
            />
          </Animated.View>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[
              styles.thumb,
              StyleSheet.flatten(thumbStyle),
              this.getLayout(),
            ]}
            onLayout={this.handleThumbLayoutChange}
          >
            {children || (
              <Image
                style={[styles.defaultThumb]}
                source={require('./thumb.png')}
              />
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  };
}
