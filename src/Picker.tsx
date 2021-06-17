import type { MutableRefObject } from 'react';
import React from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  PanResponderInstance,
} from 'react-native';
import { THUMB_HEIGHT, THUMB_WIDTH } from './config';
import type { Point } from './Point';

const { width } = Dimensions.get('screen');

export interface PickerState {
  radius: number;

  center: Point;

  thumbColor: string;
}

interface Rad {
  rad: number;

  d: number;
}

export abstract class Picker<T> extends React.Component<
  PickerProps<T>,
  PickerState
> {
  /**
   * Animated listener ID
   */
  protected animatedId: string = '';

  protected valueRef: MutableRefObject<T> = React.createRef<T>();

  /**
   * Animated value
   *
   * @type {Animated.ValueXY}
   */
  protected thumbValue: Animated.ValueXY;

  /**
   * Animated real layout
   *
   * @type {Animated.ValueXY}
   */
  protected thumbLayout: Animated.ValueXY;

  /**
   * PanResponder
   *
   * @type {PanResponder}
   */
  protected panResponder: PanResponderInstance;

  public constructor(props: PickerProps<T>) {
    super(props);

    const radius = (width - THUMB_WIDTH) / 2;

    this.state = {
      radius,
      center: {
        x: radius,
        y: radius,
      },
      thumbColor: '',
    };

    const { value } = props;
    this.valueRef.current = value;
    const point: Point = this.fromValue(value);
    this.thumbValue = new Animated.ValueXY(point);
    this.thumbLayout = new Animated.ValueXY(point);
    this.createPanResponder();
  }

  protected abstract fromValue(value: T): Point;

  protected abstract toValue(x: number, y: number): T;

  /**
   * Get thumb color from value
   *
   * @param value {T}
   */
  protected abstract getThumbColor(value: T): string;

  /**
   * Remove animated listener
   */
  protected removeListener() {
    if (this.animatedId) {
      this.thumbValue.removeListener(this.animatedId);
      this.animatedId = '';
    }
  }

  /**
   * Get thumb layout
   */
  protected getLayout() {
    return {
      transform: [
        {
          translateX: Animated.subtract(this.thumbLayout.x, THUMB_WIDTH / 2),
        },
        {
          translateY: Animated.subtract(this.thumbLayout.y, THUMB_HEIGHT),
        },
      ],
    };
  }

  public componentDidUpdate() {
    const { value } = this.props;
    if (!this.animatedId && value !== this.valueRef.current) {
      this.setState(
        {
          thumbColor: this.getThumbColor(value),
        },
        () => {
          this.valueRef.current = value;
          const point = this.fromValue(value);
          this.thumbValue.setValue(point);
          this.thumbLayout.setValue(point);
        }
      );
    }
  }

  /**
   * Create PanResponder from initial value
   *
   * @return {void}
   */
  protected createPanResponder() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        if (this.state.thumbColor) {
          this.setState({
            thumbColor: '',
          });
        }
        this.thumbValue.extractOffset();
        this.animatedId = this.thumbValue.addListener(({ x, y }) => {
          const { rad, d } = this.calcPolar(x, y);
          const value = this.toValue(rad, d);
          this.thumbLayout.setValue(this.getThumbCoordinate(rad, d));
          this.handleChange(value);
        });
      },
      onPanResponderMove: (event, state) => {
        Animated.event(
          [
            null,
            {
              dx: this.thumbValue.x,
              dy: this.thumbValue.y,
            },
          ],
          {
            useNativeDriver: false,
          }
        )(event, state);
      },
      onPanResponderRelease: () => {
        this.thumbValue.flattenOffset();
        this.removeListener();
        const { onChangeComplete } = this.props;
        if (typeof onChangeComplete === 'function') {
          onChangeComplete(this.valueRef.current);
        }
      },
    });
  }

  /**
   * Remove listener on unmount
   */
  public componentWillUnmount() {
    this.removeListener();
  }

  /**
   * Handle value change
   *
   * @param value {T}
   */
  protected handleChange(value: T) {
    this.valueRef.current = value;
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(value);
    }
  }

  /**
   *
   * @param x {number}
   * @param y {number}
   * @returns {Rad}
   */
  protected calcPolar(x: number, y: number): Rad {
    const { center } = this.state;
    const [dx, dy] = [x - center.x, y - center.y];
    const d = Math.sqrt(dx * dx + dy * dy);
    const rad = -Math.atan2(dy, dx);
    return {
      rad,
      d,
    };
  }

  /**
   *
   * @param rad {number} - radian
   * @param d  {number} - distance
   * @returns {Point}
   */
  protected getThumbCoordinate(rad: number, d: number) {
    const { radius, center } = this.state;
    const r = Math.min(d, radius);
    return {
      x: center.x + r * Math.cos(rad),
      y: center.y - r * Math.sin(rad),
    };
  }
}

export interface PickerProps<T> {
  value?: T;

  onChange?(value: T): void | Promise<void>;

  onChangeComplete?(value: T): void | Promise<void>;
}
