
// Componente do placar
function ScoreBoard({
  score,
  timeLeft,
  difficulty,
  gameFinished,
  isTimeOver,
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

  // Aplica destaque visual quando o tempo esta acabando.
  const timerClassName = timeLeft <= 10 ? 'text-red-700 font-bold' : 'text-emerald-950'

  return (
    <header className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl bg-white/90 p-4 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-emerald-950">Pantanal Sound Memory Game</h1>
        <p className="text-sm text-emerald-800">
          Encontre os pares ouvindo os sons da fauna do Pantanal. Modo: {difficultyLabel}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-emerald-950">
        <span>Pontuacao: {score}</span>
        <span className={timerClassName}>Tempo: {timeLeft}s</span>
        {isPreviewing && <span className="min-w-0 text-emerald-900">Memorize as cartas...</span>}
        {!isPreviewing && isChecking && <span className="min-w-0 text-emerald-900">Validando jogada...</span>}
        {isTimeOver && <span className="min-w-0 text-emerald-900">Tempo encerrado</span>}
      </div>

      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={onRestart}
          className="w-full rounded-lg bg-emerald-700 px-3 py-2 text-white transition hover:bg-emerald-800 sm:w-auto"
        >
          Reiniciar
        </button>

        <button
          type="button"
          onClick={onBackToMenu}
          className="w-full rounded-lg bg-amber-600 px-3 py-2 text-white transition hover:bg-amber-700 sm:w-auto"
        >
          Menu
        </button>
      </div>

      {gameFinished && (
        <p className="text-sm font-semibold text-amber-700">
          Parabens! Voce encontrou todos os pares.
        </p>
      )}
    </header>
  )
}

export default ScoreBoard
