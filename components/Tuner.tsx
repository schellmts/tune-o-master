import { Ionicons } from '@expo/vector-icons';
import { requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import AppText from './ui/AppText';

const MOCK_STRINGS = [
  { id: 1, note: 'E', frequency: 82.41 },
  { id: 2, note: 'A', frequency: 110.0 },
  { id: 3, note: 'D', frequency: 146.83 },
  { id: 4, note: 'G', frequency: 196.0 },
  { id: 5, note: 'B', frequency: 246.94 },
  { id: 6, note: 'E', frequency: 329.63 },
];

/** Dentro desta faixa (em centésimos de tom) a corda conta como afinada — evita exigir Hz “exatos” com microfone/FFT. */
const TOLERANCE_CENTS = 18;

/** Script injetado na WebView: microfone → Analyser → Gain(0) → destination + loop rAF (FFT). */
const HTML_TUNER = `<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width" /></head>
<body style="margin:0;background:#12131e;">
<script>
(function () {
  var send = function (msg) {
    try { window.ReactNativeWebView.postMessage(String(msg)); } catch (e) {}
  };

  var ctx = null;
  var stream = null;
  var analyser = null;
  var gain = null;
  var rafId = null;
  var running = false;
  var lastSent = 0;
  var lastPostMs = 0;
  /** Pico FFT mínimo (dB). Quanto MAIS NEGATIVO (ex. -52), mais fraco o som já entra. Quanto MENOS NEGATIVO (ex. -35), precisa tocar MAIS FORTE. */
  var VOLUME_GATE_DB = -50;
  /** Quadros seguidos acima do gate antes de reportar Hz (menor = responde mais rápido). */
  var FRAMES_TO_CONFIRM = 4;
  /** Quadros abaixo do gate para limpar a leitura. */
  var FRAMES_TO_CLEAR = 18;
  var loudFrames = 0;
  var quietFrames = 0;
  var silentSent = false;

  window.__tunerCommand = async function (cmd) {
    if (cmd === 'stop') {
      running = false;
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = null;
      if (stream) {
        stream.getTracks().forEach(function (t) { t.stop(); });
        stream = null;
      }
      if (ctx) {
        try { await ctx.close(); } catch (e) {}
        ctx = null;
      }
      analyser = null;
      gain = null;
      send('LOG: Mic desligado.');
      return;
    }

    if (cmd !== 'start' || running) return;

    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') await ctx.resume();

      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });

      analyser = ctx.createAnalyser();
      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.65;

      gain = ctx.createGain();
      gain.gain.value = 0;

      var src = ctx.createMediaStreamSource(stream);
      src.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);

      running = true;
      loudFrames = 0;
      quietFrames = 0;
      silentSent = false;
      send('LOG: Ouvindo (filtro de volume ativo)...');

      var buffer = new Float32Array(analyser.frequencyBinCount);

      function loop() {
        if (!running || !analyser || !ctx) return;

        analyser.getFloatFrequencyData(buffer);
        var sr = ctx.sampleRate;
        var binHz = sr / analyser.fftSize;
        var minBin = Math.max(1, Math.floor(55 / binHz));
        var maxBin = Math.min(buffer.length - 1, Math.ceil(450 / binHz));

        var maxDb = -Infinity;
        var maxIdx = minBin;
        for (var i = minBin; i <= maxBin; i++) {
          if (buffer[i] > maxDb) {
            maxDb = buffer[i];
            maxIdx = i;
          }
        }

        if (maxDb >= VOLUME_GATE_DB) {
          quietFrames = 0;
          silentSent = false;
          loudFrames++;
          if (loudFrames >= FRAMES_TO_CONFIRM) {
            var freq = maxIdx * binHz;
            var now = Date.now();
            if (Math.abs(freq - lastSent) > 0.4 || now - lastPostMs > 120) {
              lastSent = freq;
              lastPostMs = now;
              send(freq.toFixed(2));
            }
          }
        } else {
          loudFrames = 0;
          quietFrames++;
          if (quietFrames >= FRAMES_TO_CLEAR && !silentSent) {
            quietFrames = FRAMES_TO_CLEAR;
            silentSent = true;
            send('SILENT');
          }
        }

        rafId = requestAnimationFrame(loop);
      }

      loop();
    } catch (err) {
      send('LOG: Erro: ' + (err && err.message ? err.message : String(err)));
    }
  };
})();
try { window.ReactNativeWebView.postMessage('LOG: WebView JS pronto'); } catch (e) {}
</script>
</body></html>`;

function inject(webView: WebView | null, code: string) {
  webView?.injectJavaScript(code);
}

export default function Tuner() {
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

  const target = MOCK_STRINGS.find((s) => s.id === selectedId)!;
  const detectedHz = Math.round(currentFreq);
  const targetHz = Math.round(target.frequency);
  const centsOff =
    currentFreq > 40 && target.frequency > 0
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
    <View className="flex-1 justify-between bg-[#12131e] pt-10">
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
          Alvo: {target.note} ~{targetHz} Hz
        </AppText>
      </View>

      <View className="mb-10 px-2">
        <View className="flex-row items-center justify-between gap-1">
          {MOCK_STRINGS.map((item, index) => {
            const isActive = selectedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedId(item.id)}
                className={`${isActive ? 'border-secondary bg-secondary' : 'border-[#4a4f6e] bg-[#212338]'
                  } flex-1 rounded-lg border h-24 items-center justify-center`}>
                <AppText className="mb-0.5 text-[10px] text-white">{6 - index}ª</AppText>
                <AppText className="text-[32px] leading-8 text-white">{item.note}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
