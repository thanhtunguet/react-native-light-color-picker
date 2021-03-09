import type { ViewProps } from 'react-native';

export interface CctColorPickerProps {
  value?: number;

  onValueChange?(value: number);

  onValueChangeCompleted?(value: number);

  thumbStyle?: ViewProps['style'];
}
