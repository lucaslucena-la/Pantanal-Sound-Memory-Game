function ResultModal({
  isOpen,
  resultType,
  score,
  finalCuriosity,
  finalCuriosityAnimalName,
  finalCuriosityAnimalImage,
  onRestart,
  onBackToMenu,
}) {
  if (!isOpen) {
    return null
  }

  const isWin = resultType === 'win'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
        <h2 className="text-2xl font-bold text-emerald-950">
          {isWin ? 'Parabens!' : 'Tempo esgotado!'}
        </h2>

        <p className="mt-2 text-sm text-emerald-800">
          {isWin
            ? 'Voce encontrou todos os pares antes do tempo acabar.'
            : 'Voce perdeu esta rodada. O tempo terminou antes de completar os pares.'}
        </p>

        <p className="mt-4 text-base font-semibold text-emerald-950">Pontuacao final: {score}</p>

        {isWin && (
          <section className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
            <p className="text-sm font-bold text-emerald-800">Voce sabia?</p>

            {finalCuriosityAnimalImage && (
              <div className="mt-1 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-emerald-100/70 sm:h-52">
                <img
                  src={finalCuriosityAnimalImage}
                  alt={finalCuriosityAnimalName || 'Animal do Pantanal'}
                  className="h-full w-full object-contain"
                />
              </div>
            )}

            {finalCuriosityAnimalName && (
              <p className="mt-3 text-sm font-semibold text-emerald-950">{finalCuriosityAnimalName}</p>
            )}

            <p className="mt-1 text-sm text-emerald-900">
              {finalCuriosity || 'Curiosidade indisponivel no momento.'}
            </p>
          </section>
        )}

        {!isWin && (
          <section className="mt-4 rounded-xl border border-rose-200 bg-rose-50/70 p-3">
            <p className="text-sm font-semibold text-rose-800">Nao foi dessa vez...</p>

            <div className="mt-2 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-rose-100/70 sm:h-52">
              <img
                src="/images/triste.jpeg"
                alt="Animal triste"
                className="h-full w-full object-contain"
              />
            </div>

            <p className="mt-2 text-sm text-rose-900">
              Respire fundo e tente novamente. Voce esta cada vez mais perto de acertar tudo.
            </p>
          </section>
        )}

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
