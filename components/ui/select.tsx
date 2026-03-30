import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';

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
        className="rounded-lg border border-primary bg-secondary px-3 py-3 active:opacity-80">
        <Text className={'text-white text-sm'}>
          {selected?.label ?? placeholder}
        </Text>
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
                  <Text className="text-base text-white">{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
