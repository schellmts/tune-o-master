import NearbyStoresMap from '@/components/NearbyStoresMap';
import { View } from 'react-native';

export default function MapaScreen() {
  return (
    <View className="flex-1 bg-primary pt-2">
      <NearbyStoresMap />
    </View>
  );
}
