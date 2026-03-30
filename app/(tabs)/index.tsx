import SelectInstrument from '@/components/SelectInstrument';
import Tuner from '@/components/Tuner';
import { View } from 'react-native';


export default function HomeScreen() {
  return (
    <View className='flex-1 p-6 bg-primary'>
      <View className='h-full w-full justify-between'>
        <SelectInstrument />
        <Tuner />
      </View>
    </View>
  );
}

