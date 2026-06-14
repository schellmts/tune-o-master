export const HTML_TUNER = `<!DOCTYPE html>
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
  /** Pico FFT minimo (dB). Quanto MAIS NEGATIVO (ex. -52), mais fraco o som ja entra. Quanto MENOS NEGATIVO (ex. -35), precisa tocar MAIS FORTE. */
  var VOLUME_GATE_DB = -50;
  /** Quadros seguidos acima do gate antes de reportar Hz (menor = responde mais rapido). */
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
