import React, { FC, PropsWithChildren, ReactElement } from 'react';
import nameof from 'ts-nameof.macro';
import { CctColorPicker } from 'lib/index';
import { Text, View } from 'react-native';
import { styles } from './styles';

/**
 * File: CctDemo.tsx
 * @created 2021-03-15 21:31:16
 * @author Thanh Tùng <ht@thanhtunguet.info>
 * @type {FC<PropsWithChildren<CctDemoProps>>}
 */
const CctDemo: FC<PropsWithChildren<CctDemoProps>> = (): ReactElement => {
  const [value, setValue] = React.useState<number>(30);

  return (
    <>
      <View style={[styles.tab]}>
        <CctColorPicker value={value} onValueChange={setValue} />
        <View style={[styles.demo]}>
          <Text>{value}</Text>
        </View>
      </View>
    </>
  );
};

export interface CctDemoProps {
  //
}

CctDemo.defaultProps = {
  //
};

CctDemo.propTypes = {
  //
};

CctDemo.displayName = nameof(CctDemo);

export default React.memo(CctDemo);
