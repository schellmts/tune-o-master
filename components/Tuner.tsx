import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

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
    <View className="flex-1 justify-between">
      <View className="items-center mt-10">
        <TouchableOpacity className="bg-secondary h-28 w-28 rounded-full items-center justify-center">
          <Ionicons name="mic" size={48} color="white" />
        </TouchableOpacity>
        <Text className="text-white mt-3">
          Toque a corda para iniciar
        </Text>
      </View>
      <View className="mb-6">
        <FlatList
          data={MOCK_STRINGS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 12,
            flexGrow: 1,
            justifyContent: 'center',
          }}
          renderItem={({ item }) => {

            const isActive = selectedId === item.id;

            return (
              <TouchableOpacity
                onPress={() => setSelectedId(item.id)}
                className={`${isActive ? 'bg-secondary' : 'bg-zinc-900'
                  } rounded-xl px-4 py-6 mx-1 items-center justify-center min-w-[45px]`}
              >
                <Text className="text-white text-lg font-bold">
                  {item.note}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}