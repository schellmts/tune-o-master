import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  View,
} from 'react-native';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';

export type SelectOption = { label: string; value: string };

type SelectProps = {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
};

export function Select({
  options,
  value,
  onValueChange,
  placeholder = 'Selecione…',
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        className="rounded-md border border-[#6f7394] bg-secondary px-3 h-14 active:opacity-80 flex-row items-center justify-between">
        <AppText numberOfLines={1} className="text-white text-sm">
          {selected?.label ?? placeholder}
        </AppText>
        <Ionicons name="chevron-down" size={18} color="#212338" />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-end bg-black/60">
          <Pressable className="flex-1" onPress={() => setOpen(false)} />
          <View className="max-h-[55%] rounded-t-2xl border-t border-zinc-700 bg-primary">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  className="border-b border-zinc-800 px-4 py-4 active:bg-zinc-800/80"
                  onPress={() => {
                    onValueChange(item.value);
                    setOpen(false);
                  }}>
                  <AppText className="text-white text-base">{item.label}</AppText>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
