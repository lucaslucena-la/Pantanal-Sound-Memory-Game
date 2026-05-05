import clsx from 'clsx'

// Componente responsável por renderizar uma única carta do jogo.
// Ele lida tanto com o estado visual (virada/oculta) quanto com interações do usuário.
function Card({ card, difficulty, isVisible, onFlip, onSoundHintClick, canPlaySoundHint }) {
  
  // Determina se o jogo está no modo difícil para ajustar o layout (altura das cartas).
  // Boa prática: centralizar variações de UI baseadas em estado/props.
  const isHardMode = difficulty === 'dificil'

  return (
    <button
      type="button"
      
      // Ao clicar na carta, dispara a lógica de flip (controlada externamente).
      // Importante: o componente não controla o estado, apenas dispara eventos.
      onClick={() => onFlip(card)}

      // clsx permite composição dinâmica de classes (boa prática em Tailwind).
      className={clsx(
        'group relative w-full overflow-hidden rounded-lg border border-emerald-900/20 bg-emerald-50 p-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:rounded-xl',

        // Ajuste de tamanho baseado na dificuldade
        isHardMode ? 'h-24 sm:h-28 md:h-32' : 'h-28 sm:h-32 md:h-36',

        // Quando a carta está visível (virada), aplica destaque visual
        isVisible && 'bg-white ring-2 ring-amber-400',
      )}

      // Acessibilidade: descreve o estado da carta para leitores de tela
      aria-label={isVisible ? `Carta revelada: ${card.name}` : 'Carta virada'}
    >

      {/* -------------------------------------------------- */}
      {/* ESTADO: CARTA VIRADA (FACE OCULTA) */}
      {/* -------------------------------------------------- */}
      {!isVisible ? (
        <div className="relative flex h-full items-center justify-center bg-emerald-700/90 text-lg font-semibold text-white">
          
          {/* Se for carta de som, exibe botão de "dica sonora" */}
          {card.type === 'sound' && (
            <button
              type="button"
              
              // IMPORTANTE:
              // stopPropagation impede que o clique nesse botão vire a carta.
              // Isso evita conflito entre "ouvir som" e "flip".
              onClick={(event) => {
                event.stopPropagation()
                onSoundHintClick(card)
              }}

              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full text-lg shadow sm:right-2 sm:top-2 sm:h-9 sm:w-9"

              // Acessibilidade + UX: informa se o som pode ou não ser reproduzido
              aria-label={
                canPlaySoundHint
                  ? `Ouvir som de ${card.name}`
                  : `Audio de ${card.name} indisponivel`
              }
            >

              {/* Ícone muda dependendo se o som está disponível */}
              {canPlaySoundHint ? (
                // Ícone de som ativo
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
                // Ícone de som desabilitado
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
            </button>
          )}

          {/* Conteúdo padrão da carta virada */}
          ?
        </div>
      ) : (

        /* -------------------------------------------------- */
        /* ESTADO: CARTA REVELADA */
        /* -------------------------------------------------- */
        <div className="relative h-full w-full bg-white">
          
          {/* Imagem do animal */}
          <img
            src={card.image}
            alt={card.name}
            className="h-full w-full object-cover"
          />

          {/* Overlay para cartas de som */}
          {/* Isso comunica visualmente que essa carta é sonora */}
          {card.type === 'sound' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35">
              <div className="rounded-full bg-white/90 px-3 py-2 text-2xl">
                🔊
              </div>
            </div>
          )}

          {/* Nome do animal com gradiente para legibilidade */}
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent px-2 pb-1 pt-5 sm:px-3 sm:pb-2 sm:pt-8">
            <span className="block text-[11px] font-semibold text-white sm:text-sm">
              {card.name}
            </span>
          </div>
        </div>
      )}
    </button>
  )
}

export default Card