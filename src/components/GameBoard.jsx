import Card from './Card.jsx'

// Componente do tabuleiro de jogo
function GameBoard({ cards, difficulty, onFlipCard, onSoundHintClick, canPlaySoundHint, isCardVisible, shakingMatchedCards, mismatchedCards }) {
  const gridClassName =
    difficulty === 'dificil'
      ? 'mx-auto grid w-full max-w-6xl grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 md:gap-4'
      : 'mx-auto grid w-full max-w-5xl grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:gap-4'

  return (
    <section className={gridClassName}>
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          difficulty={difficulty}
          onFlip={onFlipCard}
          onSoundHintClick={onSoundHintClick}
          canPlaySoundHint={canPlaySoundHint(card)}
          isVisible={isCardVisible(card)}
          isShaking={shakingMatchedCards.includes(card.id)}
          isMismatched={mismatchedCards.includes(card.id)}
        />
      ))}
    </section>
  )
}

export default GameBoard
