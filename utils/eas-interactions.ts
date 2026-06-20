import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import { Alert, Linking, Platform, Share } from 'react-native';

async function safeHaptic(fn: () => Promise<void>) {
  try {
    await fn();
  } catch {
    // Simulador ou plataforma sem suporte a haptics.
  }
}

export async function hapticLeve() {
  await safeHaptic(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export async function hapticSucesso() {
  await safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

export async function hapticAviso() {
  await safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
}

export async function hapticErro() {
  await safeHaptic(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error));
}

export async function compartilharTexto(titulo: string, mensagem: string) {
  await Share.share({ title: titulo, message: mensagem });
}

export async function abrirUrlExterna(url: string) {
  await WebBrowser.openBrowserAsync(url);
}

export async function abrirNoMapa(lat: number, lng: number, nome: string) {
  const label = encodeURIComponent(nome);
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;

  if (Platform.OS === 'web') {
    await abrirUrlExterna(osmUrl);
    return;
  }

  const nativeUrl =
    Platform.OS === 'ios'
      ? `maps:0,0?q=${label}@${lat},${lng}`
      : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;

  const podeAbrir = await Linking.canOpenURL(nativeUrl);
  if (podeAbrir) {
    await Linking.openURL(nativeUrl);
    return;
  }

  await abrirUrlExterna(osmUrl);
}

export function confirmarAcao(
  titulo: string,
  mensagem: string,
  onConfirm: () => void,
  destructivo = true
) {
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    {
      text: destructivo ? 'Excluir' : 'Confirmar',
      style: destructivo ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ]);
}
