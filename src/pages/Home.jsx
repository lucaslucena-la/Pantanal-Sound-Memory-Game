import clsx from 'clsx'

const difficultyOptions = [
  { id: 'facil', label: 'Fácil', description: 'Nivel introdutório para começar' },
  { id: 'medio', label: 'Médio', description: 'Desafio equilibrado para praticar' },
  { id: 'dificil', label: 'Difícil', description: 'Modo avançado para testar sua memória' },
]

function Home({ selectedDifficulty, onSelectDifficulty, onStartGame }) {
  return (
    <main
      className="min-h-screen p-4 sm:p-8"
      style={{
        backgroundImage: 'linear-gradient(rgba(4, 47, 46, 0.55), rgba(4, 47, 46, 0.55)), url(/images/background.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
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
                'rounded-xl border p-4 text-left transition',
                selectedDifficulty === option.id
                  ? 'border-emerald-700 bg-emerald-100 ring-2 ring-emerald-600'
                  : 'border-emerald-200 bg-white hover:border-emerald-400',
              )}
            >
              <span className="block text-sm font-bold text-emerald-950">{option.label}</span>
              <span className="mt-1 block text-xs text-emerald-700">{option.description}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onStartGame}
          className="mt-8 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          Iniciar jogo
        </button>
      </section>
    </main>
  )
}

export default Home
