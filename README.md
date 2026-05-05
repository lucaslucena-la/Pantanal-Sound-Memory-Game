# Pantanal Sound Memory Game

Jogo educativo de memoria com associacao visual e sonora da fauna do Pantanal.

## Descricao

O jogador deve encontrar pares corretos entre:

- 1 carta com imagem do animal
- 1 carta de som do mesmo animal

O projeto foi construido com foco em organizacao, evolucao futura e experiencia responsiva.

## Funcionalidades atuais

- Menu inicial com nome do jogo, selecao de dificuldade e botao para iniciar partida
- Dificuldades: Facil, Medio e Dificil
- Pre-visualizacao inicial com todas as cartas abertas por alguns segundos
- Logica completa do memory game (2 cartas por rodada, validacao de par e bloqueios de interacao)
- Pontuacao: acerto `+10` e erro `-5` com minimo em `0`
- Dica sonora no verso da carta de som com uso unico por carta
- Estado de fim de jogo quando todos os pares sao encontrados
- Layout responsivo para desktop, tablet e mobile

## Logica do jogo

A logica principal esta centralizada em `src/hooks/useGameLogic.js`.

Estados principais:

- `cards`
- `flippedCards`
- `matchedCards`
- `listenedSoundCards`
- `isChecking`
- `isPreviewing`
- `score`
- `gameFinished`

Fluxo resumido:

1. Inicializa o deck conforme a dificuldade
2. Exibe pre-visualizacao inicial
3. Libera cliques e controla virada de cartas
4. Valida acerto/erro ao virar a segunda carta
5. Atualiza pontuacao e estado de match
6. Permite reiniciar mantendo a dificuldade

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- Tailwind CSS
- clsx

## Como rodar o projeto

Pre-requisitos:

- Node.js
- npm

Comandos:

```bash
npm install
npm run dev
```

Build de producao:

```bash
npm run build
```

## Deploy

O projeto esta publicado na Vercel:

- https://pantanal-sound-memory-game.vercel.app/

## Estrutura de pastas

```text
src/
  assets/
    images/
    sounds/
  components/
    Card.jsx
    GameBoard.jsx
    ScoreBoard.jsx
  data/
    animals.js
  hooks/
    useGameLogic.js
  pages/
    Home.jsx
    Game.jsx
  styles/
    index.css
  App.jsx
  main.jsx
```

## Animais configurados

- Onca-pintada
- Capivara
- Arara-azul
- Anta
- Jacare
- Tamandua-bandeira
- Ariranha
- Lobo-guara
- Sapo-cururu
- Bugio
