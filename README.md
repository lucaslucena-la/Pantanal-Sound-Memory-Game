# Pantanal Sound Memory Game

Jogo educativo de memória com associação visual e sonora da fauna do Pantanal.

[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://pantanal-sound-memory-game.vercel.app/)
[![React](https://img.shields.io/badge/react-18-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-latest-yellow)](https://vitejs.dev/)

## Sobre o projeto

O jogador deve encontrar pares corretos entre uma carta com a imagem do animal e uma carta com o som correspondente. Cada partida começa com uma pré-visualização de todas as cartas abertas, ajudando o jogador a memorizar as posições antes de iniciar.

## Funcionalidades

- Menu inicial com seleção de dificuldade (Fácil, Médio, Difícil)
- Pré-visualização inicial com todas as cartas abertas
- Dica sonora no verso de cada carta de som (uso único por carta)
- Pontuação dinâmica: `+10` por acerto, `-5` por erro (mínimo 0)
- Temporização de 60 segundos por partida — fim de jogo ao esgotar o tempo
- Estado de fim de jogo ao encontrar todos os pares antes do tempo
- Reinício mantendo a dificuldade selecionada
- Layout responsivo para desktop, tablet e mobile

## Tecnologias

| Tecnologia   | Uso                                  |
|--------------|--------------------------------------|
| React        | Interface e componentes              |
| Vite         | Bundler e dev server                 |
| Tailwind CSS | Estilização                          |
| clsx         | Composição de classes condicionais   |

## Como rodar

**Pré-requisitos:** Node.js e npm

```bash
# instalar dependências
npm install

# iniciar em desenvolvimento
npm run dev

# gerar build de produção
npm run build
```

## Lógica do jogo

Centralizada em `src/hooks/useGameLogic.js`. O hook controla o ciclo completo da partida:

1. Inicializa o deck conforme a dificuldade
2. Exibe a pré-visualização inicial
3. Libera cliques e gerencia a virada de cartas
4. Valida acerto/erro ao virar a segunda carta
5. Atualiza pontuação e estado de match
6. Detecta fim de jogo e permite reiniciar

Estados gerenciados: `cards` · `flippedCards` · `matchedCards` · `listenedSoundCards` · `isChecking` · `isPreviewing` · `score` · `gameFinished`

## Estrutura de pastas

```text
src/
  assets/          # imagens e sons dos animais
  components/      # Card, GameBoard, ScoreBoard
  data/            # configuração dos animais
  hooks/           # useGameLogic (lógica central)
  pages/           # Home, Game
  styles/          # CSS global
  App.jsx
  main.jsx
```

## Animais configurados

Onça-pintada · Capivara · Arara-azul · Anta · Jacaré · Tamanduá-bandeira · Ariranha · Lobo-guará · Sapo-cururu · Bugio

## Deploy

Publicado na Vercel: https://pantanal-sound-memory-game.vercel.app/