# 🎸 Tune'o Master

## 🎵 Sobre o App

Este aplicativo tem como objetivo auxiliar músicos a afinarem seus instrumentos musicais utilizando o microfone do celular. O sistema captura o som emitido pelo instrumento, identifica a frequência da nota tocada e informa ao usuário se a nota está afinada, grave ou aguda.

O aplicativo será desenvolvido utilizando **React Native com Expo**.

### 🎯 Funcionalidades Prioritárias

- [ ] Capturar áudio do microfone  
- [ ] Identificar frequência da nota tocada  
- [ ] Mostrar nota detectada (Ex: E, A, D, G, B, E)  
- [ ] Mostrar indicador visual de afinação (grave / afinado / agudo)  
- [ ] Seleção do instrumento (Violão, Guitarra, Baixo)  
- [ ] Interface simples e intuitiva  

### 🚀 Funcionalidades Futuras (Trabalhos Futuros)

- [ ] Afinador cromático completo  
- [ ] Histórico de afinações  
- [ ] Personalização de instrumentos  
- [ ] Sons de referência para afinação manual  
---

## 🎨 Protótipos de Tela

Os protótipos das telas foram desenvolvidos utilizando o **Figma**.

🔗 **Link para visualização dos protótipos:**  
https://www.figma.com/design/09bB7iMYXJsxT4RxNL2dV4/Untitled?node-id=0-1&t=nyDtQCJEaC84ctkS-1

### Telas planejadas

**Tela 1 — Tela Inicial**
- Logo do aplicativo  
- Botão "Iniciar Afinação"  
- Seleção do instrumento  

**Tela 2 — Tela de Afinação**
- Nota detectada  
- Frequência atual (Hz)  
- Indicador visual de afinação  
- Status: Grave / Afinado / Agudo  

**Tela 3 — Tela de Configurações**
- Seleção de instrumento  
- Ajustes de sensibilidade  
- Tema claro/escuro  

---

## 🗄️ Modelagem do Banco de Dados

O aplicativo utilizará **banco de dados local SQLite**, implementado através do **Expo SQLite**.

O banco será responsável por armazenar:

- Instrumentos disponíveis  
- Configurações do usuário  
- Histórico de afinações  

🔗 **Link para modelagem do banco (diagrams.net):**  
(COLE AQUI O LINK DO DIAGRAMA)

---

### 📊 Estrutura das Tabelas

#### Tabela: instrumentos

| Campo | Tipo | Descrição |
|------|------|-----------|
| id | INTEGER | Identificador único |
| nome | TEXT | Nome do instrumento |
| afinacao | TEXT | Notas padrão do instrumento |

---

#### Tabela: historico

| Campo | Tipo | Descrição |
|------|------|-----------|
| id | INTEGER | Identificador único |
| data | TEXT | Data da afinação |
| nota | TEXT | Nota detectada |
| frequencia | REAL | Frequência detectada |

---

#### Tabela: configuracoes

| Campo | Tipo | Descrição |
|------|------|-----------|
| id | INTEGER | Identificador único |
| instrumento_id | INTEGER | Instrumento selecionado |
| tema | TEXT | Tema do aplicativo |

---

## 🗓️ Planejamento de Sprints

Duração estimada do projeto: **6 semanas**

---

### Sprint 1 — Planejamento e Protótipos  
📅 Semana 1

- Definir requisitos do aplicativo  
- Criar protótipos no Figma  
- Criar modelagem do banco  
- Criar repositório no GitHub  

---

### Sprint 2 — Estrutura do Projeto  
📅 Semana 2

- Criar projeto com Expo  
- Implementar navegação entre telas  
- Criar layout inicial  

---

### Sprint 3 — Captura de Áudio  
📅 Semana 3

- Implementar acesso ao microfone  
- Capturar sinal de áudio  
- Exibir frequência detectada  

---

### Sprint 4 — Sistema de Afinação  
📅 Semana 4

- Implementar algoritmo de detecção de nota  
- Criar indicador visual  
- Ajustar precisão da leitura  

---

### Sprint 5 — Banco de Dados  
📅 Semana 5

- Implementar SQLite  
- Criar tabelas  
- Salvar configurações  
- Salvar histórico  

---

### Sprint 6 — Testes e Finalização  
📅 Semana 6

- Testar funcionalidades  
- Corrigir bugs  
- Ajustar interface  
- Preparar entrega final  

---

## 🛠️ Tecnologias Utilizadas

- React Native  
- Expo  
- Expo AV (captura de áudio)  
- Expo SQLite  
- React Navigation  
- Figma  
- Diagrams.net  

---

## 📁 Repositório do Projeto

🔗 **Link do repositório GitHub:**  
(COLE AQUI O LINK DO SEU REPOSITÓRIO)

---

## 📌 Observações

Este projeto foi desenvolvido como parte da disciplina de **Programação Mobile**, com o objetivo de praticar o desenvolvimento de interfaces gráficas e funcionalidades móveis utilizando **React Native com Expo**.
