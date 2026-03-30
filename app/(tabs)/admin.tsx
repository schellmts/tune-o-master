import AppText from '@/components/ui/AppText';
import { View } from 'react-native';

export default function AdminScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-primary px-6">
      <AppText className="text-white text-xl">Painel Admin</AppText>
      <AppText className="text-zinc-300 text-sm mt-2 text-center">
        Configure instrumentos e afinacoes por aqui.
      </AppText>
    </View>
  );
}
