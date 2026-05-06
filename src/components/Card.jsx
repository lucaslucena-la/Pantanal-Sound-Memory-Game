import clsx from 'clsx'

function Card({ card, difficulty, isVisible, isShaking, isMismatched, onFlip, onSoundHintClick, canPlaySoundHint }) {
  const isHardMode = difficulty === 'dificil'

  const handleHintMouseDown = (event) => {
    event.stopPropagation()
  }

  const handleHintClick = (event) => {
    event.stopPropagation()
    onSoundHintClick(card)
  }

  return (
    <button
      type="button"
      onClick={() => onFlip(card)}
      className={clsx(
        'perspective group relative w-full overflow-visible rounded-lg border border-emerald-900/20 bg-transparent p-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:rounded-xl',
        isHardMode ? 'h-24 sm:h-28 md:h-32' : 'h-28 sm:h-32 md:h-36',
        card.matched
          ? 'ring-2 ring-emerald-300 shadow-[0_0_0_2px_rgba(134,239,172,0.35),0_0_16px_rgba(16,185,129,0.28)]'
          : isMismatched
            ? 'ring-2 ring-red-400 shadow-[0_0_0_2px_rgba(248,113,113,0.35),0_0_14px_rgba(239,68,68,0.25)]'
            : isVisible && 'ring-2 ring-amber-400',
        isShaking && 'match-shake',
        isMismatched && 'mismatch-shake',
      )}
      aria-label={isVisible ? `Carta revelada: ${card.name}` : 'Carta virada'}
    >
      <div
        className={clsx(
          'transform-style-preserve-3d relative h-full w-full transition-transform duration-500 ease-in-out',
          isVisible && 'rotate-y-180',
        )}
      >
        <div className="backface-hidden absolute inset-0 flex h-full items-center justify-center rounded-lg bg-emerald-700/90 text-lg font-semibold text-white md:rounded-xl">
          {card.type === 'sound' && (
            <span
              role="button"
              tabIndex={-1}
              onMouseDown={handleHintMouseDown}
              onClick={handleHintClick}
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full text-lg shadow sm:right-2 sm:top-2 sm:h-9 sm:w-9"
              aria-label={
                canPlaySoundHint
                  ? `Ouvir som de ${card.name}`
                  : `Audio de ${card.name} indisponivel`
              }
            >
              {canPlaySoundHint ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white drop-shadow sm:h-6 sm:w-6"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d="M3 10v4h4l5 4V6L7 10H3z" />
                  <path d="M16.5 12c0-1.77-1-3.29-2.5-4.03v8.06c1.5-.74 2.5-2.26 2.5-4.03z" />
                  <path d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-white drop-shadow sm:h-6 sm:w-6"
                  aria-hidden="true"
                  fill="currentColor"
                >
                  <path d="M16.5 12c0-.65-.14-1.27-.39-1.82l1.51-1.51A6.91 6.91 0 0 1 18.5 12c0 1.77-1 3.29-2.5 4.03v-2.3c.31-.49.5-1.07.5-1.73z" />
                  <path d="M19 12c0-3.17-2.11-5.85-5-6.71v2.06c1.1.33 2.06.99 2.77 1.88l1.42-1.42A8.94 8.94 0 0 0 14 3.23v2.06c2.89.86 5 3.54 5 6.71 0 1.3-.36 2.51-.98 3.55l1.46 1.46A10.9 10.9 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77z" />
                  <path d="m3.27 2 18.73 18.73-1.27 1.27-3.6-3.6c-.96.7-2.05 1.22-3.23 1.49v-2.06c.6-.18 1.16-.44 1.67-.76L12 13.5V18l-5-4H3v-4h3.5L2 3.27 3.27 2zM12 6v4.23l-2-2V10H7.77L12 6z" />
                </svg>
              )}
            </span>
          )}
          ?
        </div>

        <div className="backface-hidden rotate-y-180 absolute inset-0 rounded-lg bg-white md:rounded-xl">
          <img src={card.image} alt={card.name} className="h-full w-full rounded-lg object-cover md:rounded-xl" />

          {card.type === 'sound' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35">
              <div className="rounded-full bg-white/90 px-1.5 py-1 text-sm sm:px-2 sm:py-1.5 sm:text-base md:px-3 md:py-2 md:text-xl">🔊</div>
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent px-2 pb-1 pt-5 sm:px-3 sm:pb-2 sm:pt-8">
            <span className="block text-[11px] font-semibold text-white sm:text-sm">{card.name}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default Card
