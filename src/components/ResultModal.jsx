function ResultModal({ isOpen, resultType, score, onRestart, onBackToMenu }) {
  if (!isOpen) {
    return null
  }

  const isWin = resultType === 'win'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-emerald-950">
          {isWin ? 'Parabens!' : 'Tempo esgotado!'}
        </h2>

        <p className="mt-2 text-sm text-emerald-800">
          {isWin
            ? 'Voce encontrou todos os pares antes do tempo acabar.'
            : 'O tempo terminou. Revise os sons e tente novamente.'}
        </p>

        <p className="mt-4 text-base font-semibold text-emerald-950">Pontuacao final: {score}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="flex-1 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Jogar novamente
          </button>

          <button
            type="button"
            onClick={onBackToMenu}
            className="flex-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultModal
