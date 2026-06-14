import { Ionicons } from '@expo/vector-icons';
import AppText from '@/components/ui/AppText';
import { useRequireAdmin } from '@/hooks/use-require-admin';
import {
  apagarInstrumento,
  inserirInstrumento,
  listarInstrumentos,
  type AfinacaoInstrumento,
  type CordaAfinacao,
  type Instrumento,
} from '@/database/instrumentos';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, RefreshControl, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';

function resumoAfinacoes(afinacaoBruta: string) {
  try {
    const parsed = JSON.parse(afinacaoBruta) as { afinacoes?: AfinacaoInstrumento[]; nomeAfinacao?: string };
    if (Array.isArray(parsed.afinacoes)) return `${parsed.afinacoes.length} afinacao(oes)`;
    return parsed.nomeAfinacao ?? '1 afinacao';
  } catch {
    return 'Afinacao cadastrada';
  }
}

export default function AdminInstrumentosScreen() {
  const logado = useRequireAdmin();
  const db = useSQLiteContext();

  const [feedback, setFeedback] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([]);
  const [nomeInstrumento, setNomeInstrumento] = useState('');
  const [modalAfinacaoAberto, setModalAfinacaoAberto] = useState(false);
  const [afinacoesCadastro, setAfinacoesCadastro] = useState<AfinacaoInstrumento[]>([]);
  const [nomeAfinacao, setNomeAfinacao] = useState('E standard');
  const [quantidadeCordas, setQuantidadeCordas] = useState('6');
  const [cordas, setCordas] = useState<CordaAfinacao[]>(
    Array.from({ length: 6 }, () => ({ nota: '', frequencia: '' }))
  );

  const carregarInstrumentos = useCallback(async () => {
    const rows = await listarInstrumentos(db);
    setInstrumentos(rows);
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      if (logado) void carregarInstrumentos();
    }, [logado, carregarInstrumentos])
  );

  const atualizarDados = async () => {
    setRefreshing(true);
    try {
      await carregarInstrumentos();
    } finally {
      setRefreshing(false);
    }
  };

  const ajustarQuantidadeCordas = (qtd: string) => {
    const numero = Number.parseInt(qtd, 10);
    if (Number.isNaN(numero) || numero < 1 || numero > 12) {
      setQuantidadeCordas(qtd);
      return;
    }
    setQuantidadeCordas(String(numero));
    setCordas((prev) => {
      if (prev.length === numero) return prev;
      if (prev.length > numero) return prev.slice(0, numero);
      return [...prev, ...Array.from({ length: numero - prev.length }, () => ({ nota: '', frequencia: '' }))];
    });
  };

  const adicionarLinhaCorda = () => {
    setCordas((prev) => {
      if (prev.length >= 12) return prev;
      const next = [...prev, { nota: '', frequencia: '' }];
      setQuantidadeCordas(String(next.length));
      return next;
    });
  };

  const removerLinhaCorda = (index: number) => {
    setCordas((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.filter((_, i) => i !== index);
      setQuantidadeCordas(String(next.length));
      return next;
    });
  };

  const adicionarAfinacao = () => {
    setFeedback('');
    const qtd = Number.parseInt(quantidadeCordas, 10);
    if (Number.isNaN(qtd) || qtd < 1) {
      setFeedback('Quantidade de cordas invalida.');
      return;
    }
    const cordasValidas = cordas.slice(0, qtd).map((c) => ({
      nota: c.nota.trim(),
      frequencia: c.frequencia.trim(),
    }));
    if (cordasValidas.some((c) => !c.nota)) {
      setFeedback('Preencha as notas de todas as cordas.');
      return;
    }
    setAfinacoesCadastro((prev) => [
      ...prev,
      {
        nomeAfinacao: nomeAfinacao.trim() || `Afinacao ${prev.length + 1}`,
        quantidadeCordas: qtd,
        cordas: cordasValidas,
      },
    ]);
    setNomeAfinacao(`Afinacao ${afinacoesCadastro.length + 2}`);
    setQuantidadeCordas('6');
    setCordas(Array.from({ length: 6 }, () => ({ nota: '', frequencia: '' })));
    setFeedback('Afinacao adicionada.');
  };

  const removerAfinacao = (index: number) => {
    setAfinacoesCadastro((prev) => prev.filter((_, i) => i !== index));
  };

  const salvarInstrumento = async () => {
    setFeedback('');
    if (!nomeInstrumento.trim()) {
      setFeedback('Informe o nome do instrumento.');
      return;
    }
    if (afinacoesCadastro.length === 0) {
      setFeedback('Adicione pelo menos uma afinacao.');
      return;
    }
    await inserirInstrumento(db, nomeInstrumento, afinacoesCadastro);
    setNomeInstrumento('');
    setAfinacoesCadastro([]);
    setNomeAfinacao('E standard');
    setQuantidadeCordas('6');
    setCordas(Array.from({ length: 6 }, () => ({ nota: '', frequencia: '' })));
    setFeedback('Instrumento cadastrado com sucesso.');
    await carregarInstrumentos();
  };

  if (!logado) return null;

  return (
    <View className="flex-1 bg-primary px-4 pt-6">
      <View className="flex-row items-center justify-between">
        <AppText className="text-white text-xl">Cadastro de Instrumentos</AppText>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {!!feedback && <AppText className="text-zinc-300 text-xs mt-2">{feedback}</AppText>}

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-10"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void atualizarDados()} />}>
        <AppText className="text-zinc-300 text-xs mt-1">
          Cadastre os instrumentos com suas afinacoes.
        </AppText>

        <View className="mt-4 gap-2">
          {instrumentos.map((item) => (
            <View key={item.id} className="rounded-lg bg-[#343753] border border-white/10 p-3">
              <View className="flex-row items-center justify-between">
                <AppText className="text-white text-base">{item.nome}</AppText>
                <TouchableOpacity onPress={() => void apagarInstrumento(db, item.id).then(carregarInstrumentos)}>
                  <Ionicons name="trash-outline" size={16} color="#f87171" />
                </TouchableOpacity>
              </View>
              <AppText className="text-zinc-400 text-xs mt-1">{resumoAfinacoes(item.afinacao)}</AppText>
            </View>
          ))}
        </View>

        <View className="mt-5 rounded-lg bg-[#343753] border border-white/10 p-3">
          <AppText className="text-white text-base mb-2">Novo instrumento</AppText>
          <TextInput
            value={nomeInstrumento}
            onChangeText={setNomeInstrumento}
            placeholder="Nome"
            placeholderTextColor="#9ca3af"
            className="rounded border border-white/10 bg-[#4a4f6e] px-2 py-2 text-white mb-2"
          />
          <TouchableOpacity
            onPress={() => setModalAfinacaoAberto(true)}
            className="rounded border border-white/20 px-3 py-2 mb-2 flex-row items-center justify-between">
            <AppText className="text-white">Adicionar afinacao ({afinacoesCadastro.length})</AppText>
            <Ionicons name="add-circle-outline" size={18} color="#cbd5e1" />
          </TouchableOpacity>
          {afinacoesCadastro.map((a, idx) => (
            <View key={`${a.nomeAfinacao}-${idx}`} className="flex-row items-center justify-between py-1">
              <AppText className="text-zinc-300 text-xs">
                {a.nomeAfinacao} - {a.quantidadeCordas} cordas
              </AppText>
              <TouchableOpacity onPress={() => removerAfinacao(idx)}>
                <Ionicons name="trash-outline" size={14} color="#fca5a5" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={salvarInstrumento} className="rounded bg-secondary py-2 mt-2 items-center">
            <AppText className="text-[#202132] font-semibold">Adicionar instrumento</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalAfinacaoAberto} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="max-h-[88%] rounded-t-2xl bg-primary border-t border-white/10 p-4">
            <View className="flex-row items-center justify-between mb-3">
              <AppText className="text-white text-lg">Nova afinacao</AppText>
              <TouchableOpacity onPress={() => setModalAfinacaoAberto(false)}>
                <Ionicons name="close-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View className="flex-row gap-2 mb-2">
                <TextInput
                  value={quantidadeCordas}
                  onChangeText={ajustarQuantidadeCordas}
                  placeholder="Qtd de cordas"
                  placeholderTextColor="#9ca3af"
                  keyboardType="number-pad"
                  className="flex-1 rounded border border-white/10 bg-[#4a4f6e] px-2 py-2 text-white"
                />
                <TextInput
                  value={nomeAfinacao}
                  onChangeText={setNomeAfinacao}
                  placeholder="Nome da afinacao"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 rounded border border-white/10 bg-[#4a4f6e] px-2 py-2 text-white"
                />
              </View>
              <View className="flex-row items-center justify-end gap-2 mb-2">
                <TouchableOpacity
                  onPress={() => removerLinhaCorda(cordas.length - 1)}
                  className="rounded border border-white/20 px-3 py-1">
                  <AppText className="text-white">- Remover linha</AppText>
                </TouchableOpacity>
                <TouchableOpacity onPress={adicionarLinhaCorda} className="rounded bg-secondary px-3 py-1">
                  <AppText className="text-[#202132] font-semibold">+ Adicionar linha</AppText>
                </TouchableOpacity>
              </View>
              {cordas.map((corda, idx) => (
                <View key={idx} className="flex-row gap-2 mb-2">
                  <TextInput
                    value={corda.nota}
                    onChangeText={(txt) =>
                      setCordas((prev) => prev.map((c, i) => (i === idx ? { ...c, nota: txt } : c)))
                    }
                    placeholder={`Nota corda ${idx + 1}`}
                    placeholderTextColor="#9ca3af"
                    className="flex-1 rounded border border-white/10 bg-[#4a4f6e] px-2 py-2 text-white"
                  />
                  <TextInput
                    value={corda.frequencia}
                    onChangeText={(txt) =>
                      setCordas((prev) => prev.map((c, i) => (i === idx ? { ...c, frequencia: txt } : c)))
                    }
                    placeholder="Frequencia"
                    placeholderTextColor="#9ca3af"
                    keyboardType="decimal-pad"
                    className="flex-1 rounded border border-white/10 bg-[#4a4f6e] px-2 py-2 text-white"
                  />
                  <TouchableOpacity
                    onPress={() => removerLinhaCorda(idx)}
                    className="items-center justify-center rounded border border-white/10 px-2">
                    <Ionicons name="remove-outline" size={16} color="#fca5a5" />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={adicionarAfinacao} className="rounded bg-secondary py-2 mt-1 items-center">
                <AppText className="text-[#202132] font-semibold">Adicionar afinacao</AppText>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
