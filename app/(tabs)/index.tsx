import SelectInstrument from '@/components/SelectInstrument';
import Tuner from '@/components/Tuner';
import { View } from 'react-native';


export default function HomeScreen() {
  return (
    <View className="flex-1 bg-primary px-6 pt-4 pb-2">
      <View className="h-full w-full justify-between">
        <SelectInstrument />
        <Tuner />
      </View>
    </View>
  );
}

