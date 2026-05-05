import { useState } from 'react'
import Game from './pages/Game.jsx'
import Home from './pages/Home.jsx'

function App() {
  const [screen, setScreen] = useState('home')
  const [difficulty, setDifficulty] = useState('facil')

  const handleStartGame = () => {
    setScreen('game')
  }

  const handleBackToMenu = () => {
    setScreen('home')
  }

  if (screen === 'home') {
    return (
      <Home
        selectedDifficulty={difficulty}
        onSelectDifficulty={setDifficulty}
        onStartGame={handleStartGame}
      />
    )
  }

  return <Game difficulty={difficulty} onBackToMenu={handleBackToMenu} />
}

export default App
