import { Ionicons } from '@expo/vector-icons';
import { requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { HTML_TUNER } from './tunerHtml';
import AppText from './ui/AppText';

type TunerString = { id: number; note: string; frequency: number };

/** Dentro desta faixa (em centésimos de tom) a corda conta como afinada — evita exigir Hz “exatos” com microfone/FFT. */
const TOLERANCE_CENTS = 18;

function inject(webView: WebView | null, code: string) {
  webView?.injectJavaScript(code);
}

type Props = { strings: TunerString[] };

export default function Tuner({ strings }: Props) {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [currentFreq, setCurrentFreq] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [logs, setLogs] = useState<string[]>(['Toque no microfone para começar.']);
  const [webReady, setWebReady] = useState(false);
  const webReadyRef = useRef(false);
  const webViewRef = useRef<WebView>(null);
  const startAttempts = useRef(0);

  useEffect(() => {
    webReadyRef.current = webReady;
  }, [webReady]);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [msg, ...prev].slice(0, 6));
  }, []);

  useEffect(() => {
    if (strings.length === 0) {
      setSelectedId(1);
      return;
    }
    setSelectedId((prev) => (strings.some((s) => s.id === prev) ? prev : strings[0].id));
  }, [strings]);

  const target = strings.find((s) => s.id === selectedId);
  const detectedHz = Math.round(currentFreq);
  const targetHz = target ? Math.round(target.frequency) : 0;
  const centsOff =
    currentFreq > 40 && target && target.frequency > 0
      ? 1200 * Math.log2(currentFreq / target.frequency)
      : 0;

  let status = 'SILÊNCIO';
  let statusColor = 'text-gray-500';

  if (currentFreq > 0 && detectedHz > 0) {
    if (Math.abs(centsOff) <= TOLERANCE_CENTS) {
      status = 'AFINADA';
      statusColor = 'text-green-400';
    } else if (centsOff > TOLERANCE_CENTS) {
      status = 'MUITO ALTA';
      statusColor = 'text-red-400';
    } else {
      status = 'MUITO BAIXA';
      statusColor = 'text-yellow-400';
    }
  }

  const toggleTuner = async () => {
    if (strings.length === 0) {
      addLog('Sem cordas cadastradas nessa afinacao.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      setCurrentFreq(0);
      inject(webViewRef.current, "(function(){if(window.__tunerCommand)window.__tunerCommand('stop');true;})();");
      addLog('Microfone desligado.');
      return;
    }

    try {
      addLog('Pedindo permissão de áudio...');
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        addLog('Permissão negada.');
        return;
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: 'duckOthers',
        shouldRouteThroughEarpiece: false,
      });

      setIsListening(true);
      addLog('Iniciando captura...');
      startAttempts.current = 0;

      const tryStart = () => {
        startAttempts.current += 1;
        inject(
          webViewRef.current,
          "(function(){if(window.__tunerCommand){window.__tunerCommand('start');}true;})();"
        );
        if (!webReadyRef.current && startAttempts.current < 12) {
          setTimeout(tryStart, 250);
        } else if (!webReadyRef.current && startAttempts.current >= 12) {
          addLog('WebView lenta: verifique atualização do app ou reinicie.');
          setIsListening(false);
        }
      };

      setTimeout(tryStart, webReadyRef.current ? 100 : 300);
    } catch (err) {
      addLog('Erro: ' + String(err));
    }
  };

  return (
    <View className="flex-1 justify-between pt-10">
      <View
        pointerEvents="none"
        collapsable={false}
        style={{
          position: 'absolute',
          left: -2000,
          top: 0,
          width: 320,
          height: 240,
          opacity: 0.02,
        }}>
        <WebView
          ref={webViewRef}
          source={{ html: HTML_TUNER, baseUrl: 'https://localhost' }}
          originWhitelist={['*']}
          onLoad={() => {
            webReadyRef.current = true;
            setWebReady(true);
          }}
          onLoadEnd={() => {
            webReadyRef.current = true;
            setWebReady(true);
          }}
          onError={(e) =>
            addLog(`WebView erro: ${e.nativeEvent.description ?? 'desconhecido'}`)
          }
          onMessage={(e) => {
            const data = e.nativeEvent.data;
            if (data.startsWith('LOG:')) {
              webReadyRef.current = true;
              setWebReady(true);
              addLog(data.replace(/^LOG:\s*/, ''));
            } else if (data === 'SILENT') {
              setCurrentFreq(0);
            } else {
              const f = parseFloat(data);
              if (!isNaN(f) && f > 40 && f < 500) {
                setCurrentFreq(f);
              }
            }
          }}
          javaScriptEnabled
          domStorageEnabled
          mediaCapturePermissionGrantType="grant"
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="always"
        />
      </View>

      <View className="items-center px-4">
        <View className="mb-4 w-full rounded-lg border border-white/10 bg-black/30 p-2">
          {logs.map((log, i) => (
            <AppText key={i} className="font-mono text-[10px] text-gray-400">
              {log}
            </AppText>
          ))}
        </View>

        <TouchableOpacity
          onPress={toggleTuner}
          className={`${isListening ? 'bg-red-500' : 'bg-secondary'
            } h-32 w-32 items-center justify-center rounded-full shadow-lg`}>
          <Ionicons name={isListening ? 'stop' : 'mic-outline'} size={54} color="#202132" />
        </TouchableOpacity>

        <AppText className="mt-4 text-[24px] text-white">
          {currentFreq > 0 ? `${detectedHz} Hz` : '---'}
        </AppText>

        <AppText className={`mt-2 text-[32px] font-bold uppercase ${statusColor}`}>
          {isListening ? status : 'OFFLINE'}
        </AppText>

        <AppText className="mt-1 text-center text-xs text-zinc-500">
          {target ? `Alvo: ${target.note} ~${targetHz} Hz` : 'Sem alvo selecionado'}
        </AppText>
      </View>

      <View className="mb-10 px-2">
        <View className="flex-row items-center justify-between gap-1">
          {strings.map((item, index) => {
            const isActive = selectedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                className={`${isActive ? 'border-secondary bg-secondary' : 'border-[#4a4f6e] bg-[#212338]'
                  } flex-1 rounded-lg border h-24 items-center justify-center`}>
                <AppText className="mb-0.5 text-[10px] text-white">{strings.length - index}ª</AppText>
                <AppText className="text-[32px] leading-8 text-white">{item.note}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
