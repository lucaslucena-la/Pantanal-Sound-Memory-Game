# Pantanal Sound Memory Game

Jogo educativo de memória com associação visual e sonora da fauna do Pantanal.

## Descrição

O jogador deve encontrar pares corretos entre:

- 1 carta com imagem do animal
- 1 carta de som do mesmo animal

O projeto foi construído com foco em organização, evolução futura e experiência responsiva.

## Funcionalidades atuais

- Menu inicial com:
  - nome do jogo
  - seleção de dificuldade
  - botão para iniciar partida
- Dificuldades:
  - Fácil
  - Médio
  - Difícil
- Pré-visualização inicial:
  - todas as cartas ficam abertas por alguns segundos antes da rodada começar
- Lógica completa do memory game:
  - até 2 cartas por rodada
  - validação de par por animal e tipo (`image` x `sound`)
  - bloqueio de interação durante checagem
- Pontuação:
  - acerto: `+10`
  - erro: `-5` (com mínimo em `0`)
- Dica sonora no verso da carta de som:
  - ícone no canto superior direito
  - toca o som do animal da carta
  - uso único por carta (depois o ícone fica desabilitado)
- Estado de fim de jogo quando todos os pares são encontrados
- Layout responsivo para desktop, tablet e mobile

## Lógica do jogo

A lógica principal está centralizada em `src/hooks/useGameLogic.js`.

Estados principais controlados no hook:

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
2. Exibe pré-visualização inicial
3. Libera cliques e controla virada de cartas
4. Valida acerto/erro ao virar a segunda carta
5. Atualiza pontuação e estado de match
6. Permite reiniciar mantendo a dificuldade

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- Tailwind CSS
- clsx

## Como rodar o projeto

Pré-requisitos:

- Node.js
- npm

Comandos:

```bash
npm install
npm run dev
```

Build de produção:


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

- Onça-pintada
- Capivara
- Arara-azul
- Anta
- Jacaré
- Tamanduá-bandeira
- Ariranha
- Lobo-guará
- Sapo-cururu
- Bugio

