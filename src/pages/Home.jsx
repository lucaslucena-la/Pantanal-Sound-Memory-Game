import clsx from 'clsx'

const difficultyOptions = [
  { id: 'facil', label: 'Fácil', description: 'Nivel introdutório para começar', emoji: '🐢' },
  { id: 'medio', label: 'Médio', description: 'Desafio equilibrado para praticar', emoji: '🦊' },
  { id: 'dificil', label: 'Difícil', description: 'Modo avançado para testar sua memória', emoji: '🔥' },
]

function Home({ selectedDifficulty, onSelectDifficulty, onStartGame }) {
  return (
    <main
      className="relative min-h-screen p-4 sm:p-8"
      style={{
        backgroundImage: 'linear-gradient(rgba(4, 47, 46, 0.55), rgba(4, 47, 46, 0.55)), url(/images/image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute right-4 top-4 rounded-full border border-emerald-100/40 bg-emerald-950/45 px-3 py-1.5 text-xs font-semibold text-emerald-50 shadow-md backdrop-blur-sm sm:right-8 sm:top-8 sm:px-4 sm:py-2 sm:text-sm">
        🌿 Sons do Pantanal
      </div>

      <section className="mx-auto flex min-h-[85vh] w-full max-w-3xl flex-col justify-center p-5 sm:p-8">
        <h1 className="text-center text-3xl font-extrabold text-white drop-shadow sm:text-4xl">
          Pantanal Sound Memory Game
        </h1>
        <p className="mt-3 text-center text-sm text-emerald-50 sm:text-base">
          Associe imagem e som dos animais da fauna do Pantanal em um jogo educativo e divertido.
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {difficultyOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectDifficulty(option.id)}
              className={clsx(
                'relative rounded-2xl border p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg',
                selectedDifficulty === option.id
                  ? 'border-emerald-700 bg-emerald-100 ring-2 ring-emerald-500'
                  : 'border-emerald-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/80',
              )}
            >
              <span className="absolute right-2 top-2 text-lg drop-shadow-sm sm:text-3xl">
                {option.emoji}
              </span>
              <span className="block text-sm font-bold text-emerald-950">{option.label}</span>
              <span className="mt-1 block text-xs text-emerald-700">{option.description}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onStartGame}
          className="mt-8 rounded-2xl bg-emerald-700 px-2 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg"
        >
          Iniciar jogo
        </button>
      </section>
    </main>
  )
}

export default Home
