import SelectInstrument from '@/components/SelectInstrument';
import Tuner from '@/components/Tuner';
import { listarInstrumentos } from '@/database/instrumentos';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

type Corda = { nota: string; frequencia: string };
type Afinacao = { nomeAfinacao: string; cordas: Corda[] };
type InstrumentoParsed = { id: number; nome: string; afinacoes: Afinacao[] };

function parseInstrumentos(rows: Awaited<ReturnType<typeof listarInstrumentos>>): InstrumentoParsed[] {
  return rows
    .map((row) => {
      try {
        const parsed = JSON.parse(row.afinacao) as {
          afinacoes?: { nomeAfinacao?: string; cordas?: Corda[] }[];
          nomeAfinacao?: string;
          cordas?: Corda[];
        };
        const afinacoes = Array.isArray(parsed.afinacoes)
          ? parsed.afinacoes.map((a) => ({
              nomeAfinacao: a?.nomeAfinacao?.trim() || 'Padrao',
              cordas: Array.isArray(a?.cordas) ? a.cordas : [],
            }))
          : [
              {
                nomeAfinacao: parsed.nomeAfinacao?.trim() || 'Padrao',
                cordas: Array.isArray(parsed.cordas) ? parsed.cordas : [],
              },
            ];
        return { id: row.id, nome: row.nome, afinacoes };
      } catch {
        return null;
      }
    })
    .filter((item): item is InstrumentoParsed => item != null);
}

export default function HomeScreen() {
  const db = useSQLiteContext();
  const [instrumentos, setInstrumentos] = useState<InstrumentoParsed[]>([]);
  const [instrumentoSelecionado, setInstrumentoSelecionado] = useState('');
  const [afinacaoSelecionada, setAfinacaoSelecionada] = useState('');

  const carregar = useCallback(async () => {
    const rows = await listarInstrumentos(db);
    const parsed = parseInstrumentos(rows);
    setInstrumentos(parsed);
    setInstrumentoSelecionado((prev) => {
      if (parsed.length === 0) return '';
      if (parsed.some((item) => String(item.id) === prev)) return prev;
      return String(parsed[0].id);
    });
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar])
  );

  const instrumentoAtual = useMemo(
    () => instrumentos.find((item) => String(item.id) === instrumentoSelecionado),
    [instrumentos, instrumentoSelecionado]
  );

  useEffect(() => {
    const primeira = instrumentoAtual?.afinacoes[0]?.nomeAfinacao ?? '';
    if (!instrumentoAtual) {
      setAfinacaoSelecionada('');
      return;
    }
    if (!instrumentoAtual.afinacoes.some((a) => a.nomeAfinacao === afinacaoSelecionada)) {
      setAfinacaoSelecionada(primeira);
    }
  }, [instrumentoAtual, afinacaoSelecionada]);

  const afinacaoAtual = useMemo(() => {
    if (!instrumentoAtual) return null;
    return (
      instrumentoAtual.afinacoes.find((a) => a.nomeAfinacao === afinacaoSelecionada) ??
      instrumentoAtual.afinacoes[0] ??
      null
    );
  }, [instrumentoAtual, afinacaoSelecionada]);

  const cordasTuner = useMemo(
    () =>
      (afinacaoAtual?.cordas ?? [])
        .map((corda, idx) => ({
          id: idx + 1,
          note: corda.nota?.trim(),
          frequency: Number.parseFloat(corda.frequencia),
        }))
        .filter((c) => c.note && !Number.isNaN(c.frequency) && c.frequency > 0),
    [afinacaoAtual]
  );

  return (
    <View className="flex-1 bg-primary px-6 pt-4 pb-2">
      <View className="h-full w-full justify-between">
        <SelectInstrument
          instrumentos={instrumentos.map((item) => ({ label: item.nome, value: String(item.id) }))}
          afinacoes={(instrumentoAtual?.afinacoes ?? []).map((a) => ({
            label: a.nomeAfinacao,
            value: a.nomeAfinacao,
          }))}
          instrumentoSelecionado={instrumentoSelecionado}
          afinacaoSelecionada={afinacaoSelecionada}
          onSelecionarInstrumento={setInstrumentoSelecionado}
          onSelecionarAfinacao={setAfinacaoSelecionada}
        />
        <Tuner strings={cordasTuner} />
      </View>
    </View>
  );
}

