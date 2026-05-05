import GameBoard from '../components/GameBoard.jsx'
import ScoreBoard from '../components/ScoreBoard.jsx'
import { useGameLogic } from '../hooks/useGameLogic.js'

function Game({ difficulty, onBackToMenu }) {
  // Hook centraliza o estado do jogo para manter a pagina limpa e escalavel.
  const {
    cards,
    score,
    gameFinished,
    isPreviewing,
    isChecking,
    handleCardClick,
    handleSoundHintClick,
    canPlaySoundHint,
    isCardVisible,
    restartGame,
  } = useGameLogic(difficulty)

  return (
    <main
      className="min-h-screen p-2 sm:p-4 md:p-8"
      style={{
        backgroundImage: 'linear-gradient(rgba(4, 47, 46, 0.55), rgba(4, 47, 46, 0.55)), url(/images/background.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 sm:gap-5 md:gap-6">
        <ScoreBoard
          score={score}
          difficulty={difficulty}
          gameFinished={gameFinished}
          isPreviewing={isPreviewing}
          isChecking={isChecking}
          onRestart={restartGame}
          onBackToMenu={onBackToMenu}
        />
        <GameBoard
          cards={cards}
          difficulty={difficulty}
          onFlipCard={handleCardClick}
          onSoundHintClick={handleSoundHintClick}
          canPlaySoundHint={canPlaySoundHint}
          isCardVisible={isCardVisible}
        />
      </div>
    </main>
  )
}

export default Game
