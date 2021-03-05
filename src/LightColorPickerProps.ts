import type { ViewProps } from 'react-native';

export interface LightColorPickerProps {
  color?: string;

  onColorChange?(color: string);

  thumbStyle?: ViewProps['style'];
}
