import { Select, type SelectOption } from '@/components/ui/select';
import { useState } from 'react';
import { View } from 'react-native';
import AppText from './ui/AppText';

const INSTRUMENTS: SelectOption[] = [
  { label: 'Violão', value: 'violao' },
  { label: 'Guitarra', value: 'guitarra' },
  { label: 'Baixo', value: 'baixo' },
];

const TUNINGS: SelectOption[] = [
  { label: 'E Standard', value: 'eadgbe' },
  { label: 'Drop D', value: 'drop_d' },
  { label: 'DADGAD', value: 'dadgad' },
];

export default function SelectInstrument() {
  const [instrumento, setInstrumento] = useState('guitarra');
  const [afinacao, setAfinacao] = useState('eadgbe');

  return (
    <View className="flex-row gap-3 w-full">
      <View className="gap-1.5 flex-1">
        <AppText numberOfLines={1} className="text-white text-base">
          Selecione o Instrumento
        </AppText>
        <Select
          options={INSTRUMENTS}
          value={instrumento}
          onValueChange={setInstrumento}
          placeholder="Selecione o instrumento"
        />
      </View>
      <View className="gap-1.5 flex-1">
        <AppText numberOfLines={1} className="text-white text-base">
          Afinação
        </AppText>
        <Select
          options={TUNINGS}
          value={afinacao}
          onValueChange={setAfinacao}
          placeholder="Selecione a afinação"
        />
      </View>
    </View>
  );
}
