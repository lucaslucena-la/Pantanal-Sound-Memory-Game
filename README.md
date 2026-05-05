# Pantanal Sound Memory Game

Jogo educativo de memória com associação visual e sonora da fauna do Pantanal.

[![Deploy](https://img.shields.io/badge/deploy-vercel-black)](https://pantanal-sound-memory-game.vercel.app/)
[![React](https://img.shields.io/badge/react-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/vite-latest-yellow)](https://vitejs.dev/)

## Sobre o projeto

O jogador deve encontrar pares corretos entre uma carta com a imagem do animal e uma carta com o som correspondente. Cada partida começa com uma pré-visualização de todas as cartas abertas, ajudando o jogador a memorizar as posições antes de iniciar.

## Funcionalidades

- Menu inicial com seleção de dificuldade (Fácil, Médio, Difícil)
- Pré-visualização inicial com todas as cartas abertas
- Dica sonora no verso de cada carta de som (uso único por carta)
- Pontuação dinâmica: `+10` por acerto, `-5` por erro (mínimo 0)
- Tempo por dificuldade: `Fácil 25s` · `Médio 40s` · `Difícil 60s`
- Estado de fim de jogo ao encontrar todos os pares antes do tempo
- Feedback sonoro imediato por resultado: `acerto.mp3` e `erro.mp3`
- Alerta sonoro nos últimos 10 segundos com `tempo-alerta.mp3`
- Modal de derrota com mensagem, imagem (`triste.jpeg`) e áudio de decepção (`decepcao.mp3`)
- Modal de vitória com curiosidade aleatória do último animal virado e imagem do animal
- Curiosidades em JSON (`3` por animal) com regra de não repetição imediata por animal na mesma sessão
- Feedback visual das cartas:
  - Borda amarela para carta virada
  - Borda verde clara com glow para carta acertada
  - Borda vermelha temporária + efeito de erro para tentativa incorreta
- Reinício mantendo a dificuldade selecionada
- Layout responsivo para desktop, tablet e mobile

## Tecnologias

| Tecnologia   | Uso                                  |
|--------------|--------------------------------------|
| React        | Interface e componentes              |
| Vite         | Bundler e dev server                 |
| Tailwind CSS | Estilização                          |
| clsx         | Composição de classes condicionais   |

## Clonando o repositório

Para obter o projeto localmente, utilize o comando:

```bash
git clone https://github.com/lucaslucena-la/Pantanal-Sound-Memory-Game.git
```
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
5. Dispara feedback sonoro e visual (acerto, erro, alerta de tempo)
6. Atualiza pontuação, estado de match e efeitos temporários das cartas
7. Detecta fim de jogo (vitória/derrota), abre modal correspondente e permite reiniciar

Estados gerenciados: `cards` · `flippedCards` · `matchedCards` · `listenedSoundCards` · `isChecking` · `isPreviewing` · `score` · `timeLeft` · `isTimeOver` · `showResultModal` · `resultType` · `shakingMatchedCards` · `mismatchedCards` · `finalCuriosity` · `finalCuriosityAnimalName` · `finalCuriosityAnimalImage`

## Decisões de implementação

- A lógica principal foi mantida em um único hook para garantir previsibilidade de estado e facilitar evolução de regras.
- As curiosidades ficaram em `src/data/animalCuriosities.json` para separar conteúdo educacional da lógica de jogo.
- A regra de não repetição imediata de curiosidade foi implementada em memória (sessão atual), sem persistência externa, por ser um projeto de teste.
- O alerta de tempo usa reprodução única de um áudio de ~10s para evitar artefatos de loop e atraso entre repetições.
- Feedback visual e sonoro foi priorizado para reforçar clareza de cada evento (acerto, erro, fim de tempo).

## Estrutura de pastas

```text
src/
  components/      # Card, GameBoard, ResultModal, ScoreBoard
  data/            # animais e curiosidades (JSON)
  hooks/           # useGameLogic (lógica central)
  pages/           # Home, Game
  styles/          # CSS global e animações
  App.jsx
  main.jsx
public/
  images/          # imagens dos animais, fundo e imagem de derrota
  sounds/          # sons dos animais e efeitos (acerto, erro, alerta, decepção)
```

## Animais configurados

Onça-pintada · Capivara · Arara-azul · Anta · Jacaré · Tamanduá-bandeira · Ariranha · Lobo-guará · Sapo-cururu · Bugio

## Deploy

Publicado na Vercel: https://pantanal-sound-memory-game.vercel.app/
