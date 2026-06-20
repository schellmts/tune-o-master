# 🎸 Tune'o Master

Aplicativo mobile para afinar instrumentos musicais usando o microfone do celular. Desenvolvido com **React Native** e **Expo**, como projeto da disciplina de **Programação Mobile (PDM)**.

---

## 🎵 Sobre o App

O Tune'o Master captura o som do instrumento pelo microfone, identifica a frequência da nota tocada e indica se a corda está **grave**, **afinada** ou **aguda**. O usuário escolhe instrumento e afinação cadastrados no banco local; administradores podem gerenciar instrumentos e acessos pelo painel admin.

---

## ✅ Funcionalidades implementadas

### Afinador
- [x] Captura de áudio via microfone (`expo-audio` + WebView/FFT)
- [x] Detecção de frequência em Hz
- [x] Indicador visual: grave / afinada / aguda
- [x] Seleção de instrumento e afinação (SQLite)
- [x] Seleção de corda individual
- [x] Dados iniciais: Guitarra (E Standard, Drop D) e Contrabaixo (E Standard)

### Mapa de lojas
- [x] Aba **Lojas** com mapa **OpenStreetMap + Leaflet** (WebView)
- [x] Localização GPS (`expo-location`)
- [x] Busca de lojas de instrumentos via API Overpass (OSM)
- [x] Fallback com marcadores de exemplo quando não há lojas mapeadas na região
- [x] Abrir loja no mapa nativo ou OSM
- [x] Compartilhar localização da loja

### Painel administrador
- [x] Login com validação (Zod + SQLite)
- [x] CRUD de instrumentos com múltiplas afinações (modal)
- [x] Cadastro de administradores
- [x] Pull-to-refresh nas listas
- [x] Confirmação nativa antes de excluir instrumento
- [x] Logout do painel

### Interações nativas (EAS — Checkpoint 14)
- [x] **Haptics** (`expo-haptics`) — corda afinada, login, cadastros, toques
- [x] **Compartilhamento** (`Share`) — resultado da afinação e lojas
- [x] **Navegador in-app** (`expo-web-browser`) — fallback para abrir mapa OSM
- [x] **Alertas nativos** (`Alert`) — confirmação de exclusão
- [x] **Deep link de mapa** (`Linking`) — abrir loja no app de mapas do dispositivo

### Validação (Checkpoint 11)
- [x] Schemas Zod em `validation/schemas.ts`
- [x] Login admin, criar admin, afinação e instrumento
- [x] Mensagens de erro amigáveis via `validation/parse.ts`

### Navegação e UI (Checkpoints 06 e 07)
- [x] **Expo Router** com tabs e stack aninhado
- [x] **NativeWind** (Tailwind) em todas as telas
- [x] Componentes custom: `SelectInstrument`, `Tuner`, `AppText`, `Select`, `NearbyStoresMap`

---

## ⏳ Funcionalidades planejadas (ainda não implementadas)

- [ ] Histórico de afinações (tabela `historico` já existe no SQLite)
- [ ] Tela de configurações / tema (tabela `configuracoes` já existe)
- [ ] Afinador cromático completo (modo independente de cordas)
- [ ] Persistência de sessão admin entre aberturas do app

---

## 📱 Telas do app

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `app/(tabs)/index.tsx` | Afinador |
| `/mapa` | `app/(tabs)/mapa.tsx` | Lojas próximas no mapa |
| `/admin` | `app/(tabs)/admin/index.tsx` | Login e menu admin |
| `/admin/instrumentos` | `app/(tabs)/admin/instrumentos.tsx` | CRUD de instrumentos |
| `/admin/administradores` | `app/(tabs)/admin/administradores.tsx` | CRUD de admins |

### Estrutura de navegação

```
app/
├── _layout.tsx              → Stack raiz (SQLite, fontes, título "Tune'o Master")
└── (tabs)/
    ├── _layout.tsx          → Tabs: Afinador | Lojas | Admin
    ├── index.tsx            → Afinador
    ├── mapa.tsx             → Mapa de lojas
    └── admin/
        ├── _layout.tsx      → Stack admin + auth
        ├── index.tsx        → Login / menu
        ├── instrumentos.tsx
        └── administradores.tsx
```

---

## 🗄️ Banco de dados (SQLite)

Arquivo: `tuneo.db` — migrations em `database/migration.ts`

| Tabela | Descrição |
|--------|-----------|
| `instrumentos` | Nome + afinações (JSON) |
| `admins` | Usuário e senha dos administradores |
| `historico` | Registro de afinações (estrutura pronta) |
| `configuracoes` | Instrumento favorito e tema (estrutura pronta) |
| `meta` | Versão do schema |

**Admin padrão (seed):**
- Usuário: `admin`
- Senha: `admin123`

---

## 🛠️ Tecnologias

| Área | Stack |
|------|-------|
| Framework | React Native 0.81 + Expo 54 |
| Navegação | Expo Router 6 |
| Estilo | NativeWind 4 + Tailwind CSS |
| Banco | Expo SQLite |
| Áudio | Expo Audio + WebView (FFT) |
| Mapa | React Native WebView + Leaflet + OSM |
| Localização | Expo Location |
| Validação | Zod |
| Interações nativas | Expo Haptics, Share, WebBrowser, Alert, Linking |
| Fontes | Poppins (`@expo-google-fonts/poppins`) |

---

## 🚀 Como executar

```bash
# Instalar dependências
npm install

# Iniciar o Expo
npx expo start
```

Para testar microfone e GPS no dispositivo físico (recomendado):

```bash
npx expo run:android
# ou
npx expo run:ios
```

> Após adicionar `expo-location`, pode ser necessário rebuild do dev client.

---

## 📋 Checklist acadêmico (PDM)

| Checkpoint | Tema | Status |
|------------|------|--------|
| 06 | Roteamento avançado (Expo Router) | ✅ |
| 07 | Estilização com NativeWind | ✅ |
| 11 | Validação com Zod | ✅ |
| 12 | OpenStreetMap + localização | ✅ |
| 14 | Interações EAS com o usuário | ✅ |

---

## 🎨 Protótipos

Protótipos no Figma:  
https://www.figma.com/design/09bB7iMYXJsxT4RxNL2dV4/Untitled?node-id=0-1&t=nyDtQCJEaC84ctkS-1

---

## 📁 Estrutura principal do código

```
components/          → UI reutilizável (Tuner, SelectInstrument, mapa...)
contexts/            → Auth admin em memória
database/            → SQLite, migrations, queries
services/            → Overpass API (lojas OSM)
utils/               → Interações EAS (haptics, share, mapa...)
validation/          → Schemas Zod e helper validar()
app/                 → Rotas Expo Router
```

---

## 📌 Repositório

https://github.com/schellmts/tune-o-master

---

## 📌 Observações

Projeto acadêmico da disciplina de **Programação Mobile**, focado em interfaces móveis, persistência local, integração com APIs externas (OpenStreetMap) e interações nativas do ecossistema Expo (EAS).
