import { Select, type SelectOption } from '@/components/ui/select';
import { View } from 'react-native';
import AppText from './ui/AppText';

type Props = {
  instrumentos: SelectOption[];
  afinacoes: SelectOption[];
  instrumentoSelecionado: string;
  afinacaoSelecionada: string;
  onSelecionarInstrumento: (value: string) => void;
  onSelecionarAfinacao: (value: string) => void;
};

export default function SelectInstrument({
  instrumentos,
  afinacoes,
  instrumentoSelecionado,
  afinacaoSelecionada,
  onSelecionarInstrumento,
  onSelecionarAfinacao,
}: Props) {

  return (
    <View className="flex-row gap-3 w-full">
      <View className="gap-1.5 flex-1">
        <AppText numberOfLines={1} className="text-white text-base">
          Selecione o Instrumento
        </AppText>
        <Select
          options={instrumentos}
          value={instrumentoSelecionado}
          onValueChange={onSelecionarInstrumento}
          placeholder="Cadastre um instrumento no admin"
        />
      </View>
      <View className="gap-1.5 flex-1">
        <AppText numberOfLines={1} className="text-white text-base">
          Afinação
        </AppText>
        <Select
          options={afinacoes}
          value={afinacaoSelecionada}
          onValueChange={onSelecionarAfinacao}
          placeholder={afinacoes.length > 0 ? 'Selecione a afinação' : 'Sem afinacoes'}
        />
      </View>
    </View>
  );
}
