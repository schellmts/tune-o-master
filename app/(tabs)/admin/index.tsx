import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import { useAdminAuth } from '@/contexts/admin-auth';
import { autenticarAdmin } from '@/database/admins';
import { useSQLiteContext } from 'expo-sqlite';
import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

export default function AdminIndexScreen() {
  const db = useSQLiteContext();
  const { logado, setLogado } = useAdminAuth();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const entrar = async () => {
    setErro('');
    try {
      const admin = await autenticarAdmin(db, usuario, senha);
      if (!admin) {
        setErro('Usuario ou senha invalidos.');
        return;
      }
      setLogado(true);
    } catch (e) {
      setErro('Falha ao validar acesso admin.');
      console.error('[Admin/login]', e);
    }
  };

  if (!logado) {
    return (
      <View className="flex-1 bg-primary px-4 pt-6">
        <AppText className="text-white text-xl">Painel Admin</AppText>
        <AppText className="text-zinc-300 text-sm mt-2">
          Acesso restrito para administradores.
        </AppText>

        <View className="mt-6 gap-3">
          <TextInput
            value={usuario}
            onChangeText={setUsuario}
            placeholder="Usuario"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-white"
          />
          <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder="Senha"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-white"
          />

          {!!erro && <AppText className="text-red-400 text-sm">{erro}</AppText>}

          <TouchableOpacity onPress={entrar} className="rounded-lg bg-secondary py-3 items-center">
            <AppText className="text-[#202132] font-semibold">Entrar</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary px-4 pt-6">
      <AppText className="text-white text-xl">Painel Administrador</AppText>

      <View className="mt-4 gap-3">
        <TouchableOpacity
          onPress={() => router.push('/admin/instrumentos')}
          className="rounded-lg bg-[#343753] border border-white/10 p-4 flex-row items-center justify-between">
          <View>
            <AppText className="text-white text-base">Cadastro de Instrumentos</AppText>
            <AppText className="text-zinc-400 text-xs mt-1">
              Cadastre instrumentos e suas afinacoes.
            </AppText>
          </View>
          <Ionicons name="arrow-forward" size={18} color="#cbd5e1" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/admin/administradores')}
          className="rounded-lg bg-[#343753] border border-white/10 p-4 flex-row items-center justify-between">
          <View>
            <AppText className="text-white text-base">Cadastro de Administradores</AppText>
            <AppText className="text-zinc-400 text-xs mt-1">
              Controle de acesso ao painel admin.
            </AppText>
          </View>
          <Ionicons name="arrow-forward" size={18} color="#cbd5e1" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
