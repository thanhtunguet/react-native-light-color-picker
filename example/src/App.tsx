import * as React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Button } from 'react-native-paper';
import CctDemo from './CctDemo';
import RgbDemo from './RgbDemo';
import { styles } from './styles';

export default function App() {
  const [tab, setTab] = React.useState<boolean>(false);

  const handleSwitchTab = React.useCallback(() => {
    setTab(!tab);
  }, [tab]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Button onPress={handleSwitchTab}>Switch</Button>
      {tab && <RgbDemo />}
      {!tab && <CctDemo />}
    </SafeAreaView>
  );
}
