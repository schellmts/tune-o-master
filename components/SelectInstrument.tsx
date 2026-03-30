import { Select, type SelectOption } from '@/components/ui/select';
import { useState } from 'react';
import { Text, View } from 'react-native';

const INSTRUMENTS: SelectOption[] = [
  { label: 'Violão', value: 'violao' },
  { label: 'Guitarra', value: 'guitarra' },
  { label: 'Baixo', value: 'baixo' },
];

const TUNINGS: SelectOption[] = [
  { label: 'E A D G B E (padrão)', value: 'eadgbe' },
  { label: 'Drop D', value: 'drop_d' },
  { label: 'DADGAD', value: 'dadgad' },
];

export default function SelectInstrument() {
  const [instrumento, setInstrumento] = useState('');
  const [afinacao, setAfinacao] = useState('');

  return (
    <View className="flex-row flex gap-2 justify-center w-full">
      <View className="gap-2 w-1/2">
        <Text className="text-sm text-white">Instrumento</Text>
        <Select
          options={INSTRUMENTS}
          value={instrumento}
          onValueChange={setInstrumento}
          placeholder="Selecione o instrumento"
        />
      </View>
      <View className=" w-1/2">
        {instrumento && (
          <View className='gap-2'>
            <Text className="text-sm text-white">Afinação</Text>
            <Select
              options={TUNINGS}
              value={afinacao}
              onValueChange={(value) => {
                setAfinacao(value);
              }}
              placeholder="Selecione a afinação"
            />
          </View>
        )}
      </View>
    </View>
  );
}
