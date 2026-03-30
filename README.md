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
- [ ] Afinador cromático completo  
- [ ] Histórico de afinações  
- [ ] Personalização de instrumentos  

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
- Nota detectada  
- Frequência atual (Hz)  
- Indicador visual de afinação  
- Status: Grave / Afinado / Agudo  

**Tela 2 — Tela de Administrador**
- Criação de instrumentos com suas afinações e variações  
- Ajustes de permissões   

***Observação, todos os cadastros serão utilizados modais
---

## 🗄️ Modelagem do Banco de Dados

O aplicativo utilizará **banco de dados local SQLite**, implementado através do **Expo SQLite**.

O banco será responsável por armazenar:

- Instrumentos disponíveis  
- Configurações de administradores   

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

- Criar repositório no GitHub  
- Criar modelagem do banco  
- Criar projeto com Expo
- Implementar navegação entre telas  
- Criar layout inicial 
---

### Sprint 2 — Estrutura do Projeto  
📅 Semana 2

 - Implementar acesso ao microfone  
- Capturar sinal de áudio  
- Exibir frequência detectada  

---

### Sprint 3 — Sistema de Afinação  
📅 Semana 3

- Implementar algoritmo de detecção de nota  
- Criar indicador visual  
- Ajustar precisão da leitura  

---

### Sprint 4 — Banco de Dados  
📅 Semana 4

- Implementar SQLite  
- Criar tabelas  
- Salvar configurações  
- Salvar histórico  

---

### Sprint 5 — Testes e Finalização  
📅 Semana 5

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
- Native Wind
---

## 📁 Repositório do Projeto

🔗 **Link do repositório GitHub:**  
https://github.com/schellmts/tune-o-master

---

## 📌 Observações

Este projeto foi desenvolvido como parte da disciplina de **Programação Mobile**, com o objetivo de praticar o desenvolvimento de interfaces gráficas e funcionalidades móveis utilizando **React Native com Expo**.
