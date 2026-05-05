
// Componente do placar
function ScoreBoard({
  score,
  difficulty,
  gameFinished,
  isPreviewing,
  isChecking,
  onRestart,
  onBackToMenu,
}) {
  // Mapeia o identificador de dificuldade para um rótulo legível na UI.
  const difficultyLabel = {
    facil: 'Facil',
    medio: 'Medio',
    dificil: 'Dificil',
  }[difficulty]

  return (
    <header className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-emerald-950">Pantanal Sound Memory Game</h1>
        <p className="text-sm text-emerald-800">
          {/* Exibe contexto do jogo e o modo atual selecionado. */}
          Encontre os pares ouvindo os sons da fauna do Pantanal. Modo: {difficultyLabel}
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium text-emerald-950">
        {/* Pontuação acumulada na sessão atual. */}
        <span>Pontuacao: {score}</span>
        {/* Feedback de estado para orientar o jogador durante o fluxo da rodada. */}
        {isPreviewing && <span>Memorize as cartas...</span>}
        {!isPreviewing && isChecking && <span>Validando jogada...</span>}

        {/* Ação para reiniciar a partida mantendo o modo selecionado. */}
        <button
          type="button"
          onClick={onRestart}
          className="rounded-lg bg-emerald-700 px-3 py-2 text-white transition hover:bg-emerald-800"
        >
          Reiniciar
        </button>

        {/* Navega de volta ao menu principal para nova configuração de jogo. */}
        <button
          type="button"
          onClick={onBackToMenu}
          className="rounded-lg bg-amber-600 px-3 py-2 text-white transition hover:bg-amber-700"
        >
          Menu
        </button>
      </div>

      {gameFinished && (
        // Mensagem final exibida apenas quando todos os pares forem encontrados.
        <p className="text-sm font-semibold text-amber-700">
          Parabens! Voce encontrou todos os pares.
        </p>
      )}
    </header>
  )
}

export default ScoreBoard
