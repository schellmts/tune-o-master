import AppText from '@/components/ui/AppText';
import { HTML_MAP } from '@/components/mapHtml';
import { buscarLojasProximas, lojasDemonstracao, type LojaInstrumento } from '@/services/overpass';
import { abrirNoMapa, compartilharTexto, hapticLeve } from '@/utils/eas-interactions';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

function injectMap(
  webView: WebView | null,
  lat: number,
  lng: number,
  stores: LojaInstrumento[]
) {
  const payload = JSON.stringify({
    type: 'init',
    lat,
    lng,
    zoom: 14,
    stores,
  });
  webView?.injectJavaScript(
    `(function(){if(window.__mapCommand){window.__mapCommand(${JSON.stringify(payload)});}true;})();`
  );
}

export default function NearbyStoresMap() {
  const webViewRef = useRef<WebView>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [lojas, setLojas] = useState<LojaInstrumento[]>([]);
  const [webReady, setWebReady] = useState(false);
  const coordsRef = useRef<{ lat: number; lng: number } | null>(null);

  const atualizarMapa = useCallback(
    (lat: number, lng: number, stores: LojaInstrumento[]) => {
      if (webReady) {
        injectMap(webViewRef.current, lat, lng, stores);
      } else {
        setTimeout(() => injectMap(webViewRef.current, lat, lng, stores), 400);
      }
    },
    [webReady]
  );

  const buscarPerto = useCallback(async () => {
    setCarregando(true);
    setErro('');
    setAviso('');
    await hapticLeve();
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErro('Permissao de localizacao negada. Ative para ver lojas proximas.');
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      coordsRef.current = { lat, lng };

      const encontradas = await buscarLojasProximas(lat, lng);

      if (encontradas.length === 0) {
        const exemplos = lojasDemonstracao(lat, lng);
        setLojas(exemplos);
        atualizarMapa(lat, lng, exemplos);
        setAviso(
          'Nenhuma loja real encontrada no OpenStreetMap num raio de 8 km. Mostrando exemplos perto de voce.'
        );
        return;
      }

      setLojas(encontradas);
      atualizarMapa(lat, lng, encontradas);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro desconhecido';
      setErro(`Nao foi possivel buscar lojas: ${msg}`);
      console.error('[Mapa/lojas]', e);
    } finally {
      setCarregando(false);
    }
  }, [atualizarMapa]);

  const abrirLoja = async (loja: LojaInstrumento) => {
    await hapticLeve();
    await abrirNoMapa(loja.lat, loja.lng, loja.nome);
  };

  const compartilharLoja = async (loja: LojaInstrumento) => {
    await hapticLeve();
    await compartilharTexto(
      loja.nome,
      `${loja.nome}\nCoordenadas: ${loja.lat.toFixed(5)}, ${loja.lng.toFixed(5)}\nMapa: https://www.openstreetmap.org/?mlat=${loja.lat}&mlon=${loja.lng}`
    );
  };

  return (
    <View className="flex-1 bg-primary">
      <View className="h-64 border-b border-white/10">
        <WebView
          ref={webViewRef}
          source={{ html: HTML_MAP, baseUrl: 'https://localhost' }}
          originWhitelist={['*']}
          onLoadEnd={() => setWebReady(true)}
          onMessage={() => setWebReady(true)}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
        />
      </View>

      <View className="px-4 py-3 gap-2">
        <AppText className="text-white text-base">Lojas de instrumentos perto de voce</AppText>
        <AppText className="text-zinc-400 text-xs">
          Mapa OpenStreetMap + Leaflet. Usamos sua localizacao para recomendar lojas na regiao.
        </AppText>

        <TouchableOpacity
          onPress={buscarPerto}
          disabled={carregando}
          className="rounded-lg bg-secondary py-3 items-center mt-1">
          {carregando ? (
            <ActivityIndicator color="#202132" />
          ) : (
            <AppText className="text-[#202132] font-semibold">Usar minha localizacao</AppText>
          )}
        </TouchableOpacity>

        {!!erro && <AppText className="text-red-400 text-xs">{erro}</AppText>}
        {!!aviso && <AppText className="text-zinc-300 text-xs">{aviso}</AppText>}
      </View>

      <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8">
        {lojas.map((loja) => (
          <View key={loja.id} className="mb-2 rounded-lg border border-white/10 bg-[#343753] p-3">
            <AppText className="text-white text-sm">{loja.nome}</AppText>
            <AppText className="text-zinc-500 text-xs mt-1">
              {loja.lat.toFixed(5)}, {loja.lng.toFixed(5)}
            </AppText>
            <View className="mt-2 flex-row gap-2">
              <TouchableOpacity
                onPress={() => void abrirLoja(loja)}
                className="flex-1 flex-row items-center justify-center gap-1 rounded border border-white/20 py-2">
                <Ionicons name="navigate-outline" size={14} color="#cbd5e1" />
                <AppText className="text-xs text-zinc-300">Abrir no mapa</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => void compartilharLoja(loja)}
                className="flex-row items-center justify-center gap-1 rounded border border-white/20 px-3 py-2">
                <Ionicons name="share-social-outline" size={14} color="#cbd5e1" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
