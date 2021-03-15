import type { Point } from './Point';
import type { MutableRefObject } from 'react';
import type { LayoutRectangle } from 'react-native';
import type { Animated } from 'react-native';

export interface LightColorPickerState {
  radius: number;

  isCalculated: boolean;

  center: Point;

  containerLayout: Partial<LayoutRectangle>;

  thumbLayout: Partial<LayoutRectangle>;

  animatedLayout: Animated.ValueXY;

  animatedValue: Animated.ValueXY;

  colorRef: MutableRefObject<string>;
}
