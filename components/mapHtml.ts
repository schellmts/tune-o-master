export const HTML_MAP = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #12131e; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = null;
    var userMarker = null;
    var storeLayer = null;

    function initMap(lat, lng, zoom) {
      if (!map) {
        map = L.map('map', { zoomControl: true }).setView([lat, lng], zoom || 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap'
        }).addTo(map);
        storeLayer = L.layerGroup().addTo(map);
      } else {
        map.setView([lat, lng], zoom || map.getZoom());
      }
    }

    function setUserMarker(lat, lng) {
      if (!map) return;
      if (userMarker) map.removeLayer(userMarker);
      userMarker = L.circleMarker([lat, lng], {
        radius: 8,
        color: '#ffffff',
        fillColor: '#7c83ff',
        fillOpacity: 1,
        weight: 2
      }).addTo(map).bindPopup('Voce esta aqui');
    }

    function setStores(stores) {
      if (!map || !storeLayer) return;
      storeLayer.clearLayers();
      stores.forEach(function (store) {
        L.marker([store.lat, store.lng]).addTo(storeLayer).bindPopup(store.nome);
      });
    }

    window.__mapCommand = function (payloadJson) {
      try {
        var payload = JSON.parse(payloadJson);
        if (payload.type === 'init') {
          initMap(payload.lat, payload.lng, payload.zoom);
          setUserMarker(payload.lat, payload.lng);
          setStores(payload.stores || []);
        }
      } catch (e) {
        try { window.ReactNativeWebView.postMessage('LOG:' + e.message); } catch (_) {}
      }
    };

    try { window.ReactNativeWebView.postMessage('LOG:Mapa Leaflet pronto'); } catch (_) {}
  </script>
</body>
</html>`;
