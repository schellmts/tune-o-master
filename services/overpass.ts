export type LojaInstrumento = {
  id: string;
  nome: string;
  lat: number;
  lng: number;
};

const USER_AGENT = 'TuneoMaster/1.0 (expo-app; contato@local)';

const OVERPASS_SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
];

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: { name?: string };
};

function parseOverpassElements(elements: OverpassElement[]): LojaInstrumento[] {
  const lojas: LojaInstrumento[] = [];
  const ids = new Set<string>();

  for (const el of elements) {
    const latitude = el.lat ?? el.center?.lat;
    const longitude = el.lon ?? el.center?.lon;
    if (latitude == null || longitude == null) continue;

    const key = String(el.id);
    if (ids.has(key)) continue;
    ids.add(key);

    lojas.push({
      id: key,
      nome: el.tags?.name?.trim() || 'Loja de instrumentos',
      lat: latitude,
      lng: longitude,
    });
  }

  return lojas;
}

function buildOverpassQuery(lat: number, lng: number, raioMetros: number) {
  return `
[out:json][timeout:20];
(
  node["shop"="musical_instrument"](around:${raioMetros},${lat},${lng});
  node["shop"="music"](around:${raioMetros},${lat},${lng});
);
out body 25;
`.trim();
}

async function buscarViaOverpass(
  lat: number,
  lng: number,
  raioMetros: number
): Promise<LojaInstrumento[]> {
  const query = buildOverpassQuery(lat, lng, raioMetros);
  const body = `data=${encodeURIComponent(query)}`;
  let lastError = 'Overpass indisponivel';

  for (const server of OVERPASS_SERVERS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 22000);

      const response = await fetch(server, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'User-Agent': USER_AGENT,
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        lastError = `Overpass HTTP ${response.status}`;
        continue;
      }

      const json = (await response.json()) as {
        elements?: OverpassElement[];
        remark?: string;
        error?: string;
      };

      if (json.error) {
        lastError = json.error;
        continue;
      }

      return parseOverpassElements(json.elements ?? []);
    } catch (e) {
      lastError = e instanceof Error ? e.message : 'Erro de rede Overpass';
    }
  }

  throw new Error(lastError);
}

async function buscarViaNominatim(lat: number, lng: number): Promise<LojaInstrumento[]> {
  const delta = 0.07;
  const viewbox = `${lng - delta},${lat + delta},${lng + delta},${lat - delta}`;
  const termos = ['loja instrumentos musicais', 'musical instrument shop', 'guitar center'];

  const lojas: LojaInstrumento[] = [];
  const ids = new Set<string>();

  for (const termo of termos) {
    const url =
      `https://nominatim.openstreetmap.org/search?format=json&limit=12` +
      `&q=${encodeURIComponent(termo)}&viewbox=${viewbox}&bounded=1`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': USER_AGENT,
        'Accept-Language': 'pt-BR',
      },
    });

    if (!response.ok) continue;

    const json = (await response.json()) as {
      place_id: number;
      lat: string;
      lon: string;
      display_name: string;
    }[];

    for (const item of json) {
      const key = String(item.place_id);
      if (ids.has(key)) continue;
      ids.add(key);

      lojas.push({
        id: key,
        nome: item.display_name.split(',')[0]?.trim() || 'Loja de instrumentos',
        lat: Number.parseFloat(item.lat),
        lng: Number.parseFloat(item.lon),
      });
    }
  }

  return lojas;
}

/** Marcadores de exemplo quando o OSM nao tem lojas mapeadas na regiao. */
export function lojasDemonstracao(lat: number, lng: number): LojaInstrumento[] {
  return [
    { id: 'demo-1', nome: 'Guitar Center (exemplo)', lat: lat + 0.008, lng: lng + 0.006 },
    { id: 'demo-2', nome: 'Loja de Violoes (exemplo)', lat: lat - 0.005, lng: lng + 0.004 },
    { id: 'demo-3', nome: 'Music Shop (exemplo)', lat: lat + 0.003, lng: lng - 0.007 },
  ];
}

export async function buscarLojasProximas(
  lat: number,
  lng: number,
  raioMetros = 8000
): Promise<LojaInstrumento[]> {
  try {
    const overpass = await buscarViaOverpass(lat, lng, raioMetros);
    if (overpass.length > 0) return overpass;
  } catch (e) {
    console.warn('[Mapa/overpass]', e);
  }

  const nominatim = await buscarViaNominatim(lat, lng);
  if (nominatim.length > 0) return nominatim;

  return [];
}
