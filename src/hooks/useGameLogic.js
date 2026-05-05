import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { animals } from '../data/animals.js'

// Constantes de configuração do jogo
const PREVIEW_TIME_MS = 4000
const MISMATCH_DELAY_MS = 800
const MATCH_POINTS = 10
const MISMATCH_POINTS = 5

// Mapeamento de dificuldades para quantidade de animais
const DIFFICULTY_ANIMAL_COUNT = {
  facil: 4,
  medio: 6,
  dificil: 10,
}

/**
 * Embaralha um array utilizando o algoritmo Fisher-Yates
 * @param {Array} list - Array a ser embaralhado
 * @returns {Array} Novo array embaralhado
 */
function shuffleCards(list) {
  const cloned = [...list]

  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
      ;[cloned[i], cloned[randomIndex]] = [cloned[randomIndex], cloned[i]]
  }

  return cloned
}

/**
 * Cria um baralho de cartas a partir dos animais selecionados
 * Cada animal gera 2 cartas: uma visual (imagem) e outra sonora (som)
 * @param {Array} selectedAnimals - Array de animais selecionados
 * @returns {Array} Baralho embaralhado com pares de cartas
 */
function createDeck(selectedAnimals) {
  return shuffleCards(
    selectedAnimals.flatMap((animal) => [
      {
        id: `${animal.id}-image`,
        animal: animal.id,
        type: 'image',
        name: animal.nome,
        image: animal.imagem,
        sound: animal.som,
        curiosity: animal.curiosidade,
        matched: false,
      },
      {
        id: `${animal.id}-sound`,
        animal: animal.id,
        type: 'sound',
        name: animal.nome,
        image: animal.imagem,
        sound: animal.som,
        curiosity: animal.curiosidade,
        matched: false,
      },
    ]),
  )
}

/**
 * Seleciona animais aleatórios baseado no nível de dificuldade
 * @param {string} difficulty - Nível de dificuldade (facil, medio, dificil)
 * @returns {Array} Array de animais selecionados
 */
function getAnimalsByDifficulty(difficulty) {
  const animalsCount = DIFFICULTY_ANIMAL_COUNT[difficulty] ?? DIFFICULTY_ANIMAL_COUNT.facil
  const shuffledAnimals = shuffleCards(animals)

  return shuffledAnimals.slice(0, Math.min(animalsCount, animals.length))
}

/**
 * Hook customizado que encapsula toda a lógica do jogo da memória
 * Gerencia estado das cartas, pontuação, verificação de matches e interações do usuário
 * @param {string} difficulty - Nível de dificuldade inicial (padrão: 'facil')
 * @returns {Object} Objeto com estado do jogo e funções de controle
 */
export function useGameLogic(difficulty = 'facil') {
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [listenedSoundCards, setListenedSoundCards] = useState([])
  const [isChecking, setIsChecking] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(true)
  const [score, setScore] = useState(0)
  const previewTimeoutRef = useRef(null)

  /**
   * Reproduz um arquivo de áudio com tratamento de erros
   * @param {string} soundPath - Caminho do arquivo de áudio
   */
  const playSound = (soundPath) => {
    if (!soundPath) {
      return
    }

    try {
      const audio = new Audio(soundPath)
      void audio.play()
    } catch (error) {
      console.warn('Nao foi possivel reproduzir o audio:', soundPath, error)
    }
  }

  /**
   * Verifica se uma carta deve estar visível na tela
   * Cartas ficam visíveis durante preview inicial, quando estão viradas ou já foram acertadas
   * @param {Object} card - Objeto da carta
   * @returns {boolean} True se a carta deve ser exibida
   */
  const isCardVisible = (card) => {
    if (isPreviewing) {
      return true
    }

    return (
      flippedCards.some((flipped) => flipped.id === card.id) || matchedCards.includes(card.id)
    )
  }

  /**
   * Inicializa o jogo: reseta estado, seleciona animais por dificuldade e exibe preview
   * Aguarda PREVIEW_TIME_MS antes de permitir o início efetivo do jogo
   */
  const initializeGame = useCallback(() => {
    const selectedAnimals = getAnimalsByDifficulty(difficulty)
    const deck = createDeck(selectedAnimals)

    setCards(deck)
    setFlippedCards([])
    setMatchedCards([])
    setListenedSoundCards([])
    setIsChecking(false)
    setIsPreviewing(true)
    setScore(0)

    if (previewTimeoutRef.current) {
      window.clearTimeout(previewTimeoutRef.current)
    }

    previewTimeoutRef.current = window.setTimeout(() => {
      setIsPreviewing(false)
      setFlippedCards([])
    }, PREVIEW_TIME_MS)
  }, [difficulty])

  /**
   * Verifica se duas cartas fazem match (mesmo animal, tipos diferentes)
   * Em caso de acerto: marca como matched, aumenta pontuação e toca som correto
   * Em caso de erro: diminui pontuação, aguarda MISMATCH_DELAY_MS e vira as cartas
   * @param {Object} firstCard - Primeira carta virada
   * @param {Object} secondCard - Segunda carta virada
   */
  const checkMatch = (firstCard, secondCard) => {
    setIsChecking(true)

    // Match válido: mesmo animal com tipos diferentes (imagem ≠ som)
    const isValidMatch =
      firstCard.animal === secondCard.animal && firstCard.type !== secondCard.type

    if (isValidMatch) {
      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, matched: true }
            : card,
        ),
      )
      setMatchedCards((current) => [...current, firstCard.id, secondCard.id])
      setScore((current) => current + MATCH_POINTS)
      playSound('/src/assets/sounds/correct.mp3')
      setFlippedCards([])
      setIsChecking(false)
      return
    }

    // Mismatch: reproduz som de erro, penaliza pontuação e vira as cartas
    playSound('/src/assets/sounds/error.mp3')
    window.setTimeout(() => {
      setScore((current) => Math.max(0, current - MISMATCH_POINTS))
      setFlippedCards([])
      setIsChecking(false)
    }, MISMATCH_DELAY_MS)
  }

  /**
   * Manipula o clique em uma carta
   * Valida estados (preview, checking, já acertada, limite de cartas viradas)
   * Reproduz som automaticamente ao virar carta de som
   * Inicia verificação de match ao virar segunda carta
   * @param {Object} card - Carta clicada
   */
  const handleCardClick = (card) => {
    if (isPreviewing || isChecking || card.matched || flippedCards.length === 2) {
      return
    }

    if (flippedCards.some((flippedCard) => flippedCard.id === card.id)) {
      return
    }

    const nextFlipped = [...flippedCards, card]
    setFlippedCards(nextFlipped)

    if (card.type === 'sound') {
      playSound(card.sound)
    }

    if (nextFlipped.length < 2) {
      return
    }

    const [first, second] = nextFlipped
    checkMatch(first, second)
  }

  /**
   * Verifica se uma dica sonora está disponível para uma carta
   * Dica disponível apenas se: é carta de som E ainda não foi escutada
   * @param {Object} card - Carta a verificar
   * @returns {boolean} True se dica está disponível
   */
  const canPlaySoundHint = (card) => {
    return card.type === 'sound' && !listenedSoundCards.includes(card.id)
  }

  /**
   * Manipula clique no botão de dica sonora
   * Disponível apenas no verso da carta e apenas uma vez por carta
   * Marca a dica como usada para evitar reutilização
   * @param {Object} card - Carta para reproduzir dica
   */
  const handleSoundHintClick = (card) => {
    if (isPreviewing || isChecking || isCardVisible(card) || !canPlaySoundHint(card)) {
      return
    }

    playSound(card.sound)
    setListenedSoundCards((current) => [...current, card.id])
  }

  /**
   * Reinicia o jogo chamando initializeGame
   */
  const restartGame = () => {
    initializeGame()
  }

  /**
   * Effect: inicializa o jogo ao montar o componente
   * Limpa timeouts ao desmontar para evitar memory leaks
   */
  useEffect(() => {
    const initializeTimeout = window.setTimeout(() => {
      initializeGame()
    }, 0)

    return () => {
      window.clearTimeout(initializeTimeout)

      if (previewTimeoutRef.current) {
        window.clearTimeout(previewTimeoutRef.current)
      }
    }
  }, [initializeGame])

  /**
   * Verifica se o jogo foi concluído (todas as cartas foram acertadas)
   */
  const gameFinished = useMemo(
    () => cards.length > 0 && matchedCards.length === cards.length,
    [cards.length, matchedCards.length],
  )

  return {
    cards,
    flippedCards,
    matchedCards,
    isChecking,
    isPreviewing,
    score,
    gameFinished,
    handleCardClick,
    handleSoundHintClick,
    canPlaySoundHint,
    isCardVisible,
    restartGame,
  }
}
