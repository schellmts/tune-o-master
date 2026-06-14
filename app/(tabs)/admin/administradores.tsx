import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import { useRequireAdmin } from '@/hooks/use-require-admin';
import { criarAdmin, listarAdmins } from '@/database/admins';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdminAdministradoresScreen() {
  const logado = useRequireAdmin();
  const db = useSQLiteContext();

  const [feedback, setFeedback] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [admins, setAdmins] = useState<{ id: number; usuario: string }[]>([]);
  const [novoAdminUsuario, setNovoAdminUsuario] = useState('');
  const [novoAdminSenha, setNovoAdminSenha] = useState('');

  const carregarAdmins = useCallback(async () => {
    const rows = await listarAdmins(db);
    setAdmins(rows);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      if (logado) void carregarAdmins();
    }, [logado, carregarAdmins])
  );

  const atualizarDados = async () => {
    setRefreshing(true);
    try {
      await carregarAdmins();
    } finally {
      setRefreshing(false);
    }
  };

  const cadastrarAdmin = async () => {
    setFeedback('');
    if (!novoAdminUsuario.trim() || !novoAdminSenha.trim()) {
      setFeedback('Preencha usuario e senha.');
      return;
    }
    try {
      await criarAdmin(db, novoAdminUsuario, novoAdminSenha);
      setNovoAdminUsuario('');
      setNovoAdminSenha('');
      setFeedback('Administrador cadastrado.');
      await carregarAdmins();
    } catch {
      setFeedback('Usuario ja existe ou falha ao cadastrar.');
    }
  };

  if (!logado) return null;

  return (
    <View className="flex-1 bg-primary px-4 pt-6">
      <View className="flex-row items-center justify-between">
        <AppText className="text-white text-xl">Cadastro de Administradores</AppText>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {!!feedback && <AppText className="text-zinc-300 text-xs mt-2">{feedback}</AppText>}

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void atualizarDados()} />}>
        <View className="mt-4 rounded-lg bg-[#343753] border border-white/10 p-3">
          {admins.length === 0 ? (
            <AppText className="text-zinc-400 text-sm">Nenhum administrador cadastrado.</AppText>
          ) : (
            admins.map((item) => (
              <View key={item.id} className="py-2 border-b border-white/10">
                <AppText className="text-white">{item.usuario}</AppText>
              </View>
            ))
          )}
        </View>

        <View className="mt-5 rounded-lg bg-[#343753] border border-white/10 p-3">
          <AppText className="text-white text-base mb-2">Novo administrador</AppText>
          <TextInput
            value={novoAdminUsuario}
            onChangeText={setNovoAdminUsuario}
            placeholder="Usuario"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            className="rounded border border-white/10 bg-[#4a4f6e] px-2 py-2 text-white mb-2"
          />
          <TextInput
            value={novoAdminSenha}
            onChangeText={setNovoAdminSenha}
            placeholder="Senha"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            className="rounded border border-white/10 bg-[#4a4f6e] px-2 py-2 text-white mb-2"
          />
          <TouchableOpacity onPress={cadastrarAdmin} className="rounded bg-secondary py-2 items-center">
            <AppText className="text-[#202132] font-semibold">Adicionar admin</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
