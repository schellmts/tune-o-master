import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AppText from './ui/AppText';

const MOCK_STRINGS = [
  { id: 1, note: 'E', frequency: 82.41, status: 'afinada' },
  { id: 2, note: 'A', frequency: 110.0, status: 'baixa' },
  { id: 3, note: 'D', frequency: 146.83, status: 'alta' },
  { id: 4, note: 'G', frequency: 196.0, status: 'afinada' },
  { id: 5, note: 'B', frequency: 246.94, status: 'baixa' },
  { id: 6, note: 'E', frequency: 329.63, status: 'alta' },
];

export default function Tuner() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <View className="flex-1 justify-between pt-10">
      <View className="items-center">
        <TouchableOpacity className="bg-secondary h-32 w-32 rounded-full items-center justify-center">
          <Ionicons name="mic-outline" size={54} color="#202132" />
        </TouchableOpacity>
        <AppText className="text-white mt-4 text-[30px]">Toque a corda para Iniciar</AppText>
      </View>
      <View className="mb-5">
        <View className="flex-row items-center justify-between gap-2">
          {MOCK_STRINGS.map((item, index) => {
            const isActive = selectedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                className={`${isActive ? 'bg-secondary' : 'bg-[#212338] border border-[#4a4f6e]'} flex-1 rounded-lg h-20 items-center justify-center`}
              >
                <AppText className="text-white text-[12px] leading-3 mb-0.5">{6 - index}º</AppText>
                <AppText className="text-white text-[34px] leading-8">{item.note}</AppText>
                <AppText weight="thin" className="text-white text-[12px] leading-3">
                  82Hz
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}