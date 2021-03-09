import type { ViewProps } from 'react-native';

export interface CctColorPickerProps {
  value?: number;

  onColorChange?(value: number);

  onColorChangeCompleted?(value: number);

  thumbStyle?: ViewProps['style'];
}
