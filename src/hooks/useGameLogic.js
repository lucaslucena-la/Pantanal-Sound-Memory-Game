import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { animals } from '../data/animals.js'
import animalCuriosities from '../data/animalCuriosities.json'

// Constantes de configuração do jogo
const PREVIEW_TIME_MS = 4000
const MISMATCH_DELAY_MS = 800
const MATCH_SHAKE_DURATION_MS = 420
const CARD_FLIP_DURATION_MS = 500
const MISMATCH_FEEDBACK_DURATION_MS = MISMATCH_DELAY_MS + CARD_FLIP_DURATION_MS
const TIME_WARNING_START_SECONDS = 10
const MATCH_POINTS = 10
const MISMATCH_POINTS = 5
const DIFFICULTY_TIME_SECONDS = {
  facil: 25,
  medio: 40,
  dificil: 60,
}

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

function pickRandomCuriosity(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return ''
  }

  const randomIndex = Math.floor(Math.random() * list.length)
  return list[randomIndex]
}

function getGameTimeByDifficulty(difficulty) {
  return DIFFICULTY_TIME_SECONDS[difficulty] ?? DIFFICULTY_TIME_SECONDS.dificil
}

function getRandomCuriosityIndex(curiosityCount, previousIndex) {
  if (curiosityCount <= 1) {
    return 0
  }

  const randomIndex = Math.floor(Math.random() * (curiosityCount - 1))
  return randomIndex >= previousIndex ? randomIndex + 1 : randomIndex
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
  const [timeLeft, setTimeLeft] = useState(() => getGameTimeByDifficulty(difficulty))
  const [isTimeOver, setIsTimeOver] = useState(false)
  const [showResultModal, setShowResultModal] = useState(false)
  const [resultType, setResultType] = useState(null)
  const [isHintSoundPlaying, setIsHintSoundPlaying] = useState(false)
  const [shakingMatchedCards, setShakingMatchedCards] = useState([])
  const [mismatchedCards, setMismatchedCards] = useState([])
  const [finalCuriosity, setFinalCuriosity] = useState('')
  const [finalCuriosityAnimalName, setFinalCuriosityAnimalName] = useState('')
  const [finalCuriosityAnimalImage, setFinalCuriosityAnimalImage] = useState('')
  const previewTimeoutRef = useRef(null)
  const timerIntervalRef = useRef(null)
  const currentAudioRef = useRef(null)
  const timerWarningAudioRef = useRef(null)
  const hasPlayedTimeWarningRef = useRef(false)
  const matchShakeTimeoutRef = useRef(null)
  const mismatchFeedbackTimeoutRef = useRef(null)
  const lastCuriosityIndexByAnimalRef = useRef({})

  /**
   * Limpa o intervalo do temporizador quando ele nao e mais necessario.
   */
  const clearGameTimer = () => {
    if (!timerIntervalRef.current) {
      return
    }

    window.clearInterval(timerIntervalRef.current)
    timerIntervalRef.current = null
  }

  /**
   * Interrompe qualquer audio ativo antes de iniciar um novo.
   * Isso evita sobreposicao de sons ao clicar rapido em multiplos botoes.
   */
  const stopCurrentAudio = () => {
    if (!currentAudioRef.current) {
      return
    }

    currentAudioRef.current.pause()
    currentAudioRef.current.currentTime = 0
    currentAudioRef.current = null
  }

  const stopTimerWarningAudio = () => {
    if (!timerWarningAudioRef.current) {
      return
    }

    timerWarningAudioRef.current.pause()
    timerWarningAudioRef.current.currentTime = 0
    timerWarningAudioRef.current = null
  }

  const playTimerWarningAudio = () => {
    if (timerWarningAudioRef.current || hasPlayedTimeWarningRef.current) {
      return
    }

    try {
      const warningAudio = new Audio('/sounds/tempo-alerta.mp3')
      warningAudio.loop = false
      warningAudio.volume = 0.35
      timerWarningAudioRef.current = warningAudio
      hasPlayedTimeWarningRef.current = true

      warningAudio.addEventListener('ended', () => {
        timerWarningAudioRef.current = null
      }, { once: true })

      void warningAudio.play()
    } catch (error) {
      console.warn('Nao foi possivel reproduzir o alerta de tempo:', error)
    }
  }

  /**
   * Reproduz um arquivo de áudio com tratamento de erros
   * @param {string} soundPath - Caminho do arquivo de áudio
   */
  const playSound = (soundPath, { lockHint = false } = {}) => {
    if (!soundPath) {
      return
    }

    try {
      // Regra de ouro: sempre para o audio anterior antes de tocar outro.
      stopCurrentAudio()

      const audio = new Audio(soundPath)
      currentAudioRef.current = audio

      // Quando for uma dica sonora do verso da carta, travamos novos cliques
      // ate o audio terminar para impedir sobreposicao.
      if (lockHint) {
        setIsHintSoundPlaying(true)

        audio.addEventListener('ended', () => {
          setIsHintSoundPlaying(false)
        }, { once: true })

        audio.addEventListener('pause', () => {
          setIsHintSoundPlaying(false)
        }, { once: true })
      }

      void audio.play()
    } catch (error) {
      setIsHintSoundPlaying(false)
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
    setTimeLeft(getGameTimeByDifficulty(difficulty))
    setIsTimeOver(false)
    setShowResultModal(false)
    setResultType(null)
    setIsHintSoundPlaying(false)
    setShakingMatchedCards([])
    setMismatchedCards([])
    setFinalCuriosity('')
    setFinalCuriosityAnimalName('')
    setFinalCuriosityAnimalImage('')
    hasPlayedTimeWarningRef.current = false
    setScore(0)

    clearGameTimer()
    stopCurrentAudio()
    stopTimerWarningAudio()

    if (previewTimeoutRef.current) {
      window.clearTimeout(previewTimeoutRef.current)
    }

    if (matchShakeTimeoutRef.current) {
      window.clearTimeout(matchShakeTimeoutRef.current)
      matchShakeTimeoutRef.current = null
    }

    if (mismatchFeedbackTimeoutRef.current) {
      window.clearTimeout(mismatchFeedbackTimeoutRef.current)
      mismatchFeedbackTimeoutRef.current = null
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
      const willFinishGame = matchedCards.length + 2 === cards.length
      const matchedIds = [firstCard.id, secondCard.id]

      setCards((currentCards) =>
        currentCards.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, matched: true }
            : card,
        ),
      )
      setMatchedCards((current) => [...current, firstCard.id, secondCard.id])
      setShakingMatchedCards(matchedIds)

      if (matchShakeTimeoutRef.current) {
        window.clearTimeout(matchShakeTimeoutRef.current)
      }

      matchShakeTimeoutRef.current = window.setTimeout(() => {
        setShakingMatchedCards([])
        matchShakeTimeoutRef.current = null
      }, MATCH_SHAKE_DURATION_MS)

      setScore((current) => current + MATCH_POINTS)
      playSound('/sounds/acerto.mp3')

      if (willFinishGame) {
        const finalAnimalId = secondCard.animal
        const curiosityList = animalCuriosities[finalAnimalId] ?? []
        const previousCuriosityIndex = lastCuriosityIndexByAnimalRef.current[finalAnimalId]
        const nextCuriosityIndex = getRandomCuriosityIndex(curiosityList.length, previousCuriosityIndex)
        const selectedCuriosity = curiosityList[nextCuriosityIndex] || pickRandomCuriosity(curiosityList)
        const finalAnimal = cards.find((card) => card.animal === finalAnimalId)

        lastCuriosityIndexByAnimalRef.current[finalAnimalId] = nextCuriosityIndex

        clearGameTimer()
        stopTimerWarningAudio()
        setFinalCuriosity(selectedCuriosity || 'Curiosidade indisponivel no momento.')
        setFinalCuriosityAnimalName(finalAnimal?.name ?? secondCard.name)
        setFinalCuriosityAnimalImage(finalAnimal?.image ?? secondCard.image ?? '')
        setResultType('win')
        setShowResultModal(true)
      }

      setFlippedCards([])
      setIsChecking(false)
      return
    }

    // Mismatch: reproduz som de erro, penaliza pontuação e vira as cartas
    setMismatchedCards([firstCard.id, secondCard.id])

    if (mismatchFeedbackTimeoutRef.current) {
      window.clearTimeout(mismatchFeedbackTimeoutRef.current)
    }

    mismatchFeedbackTimeoutRef.current = window.setTimeout(() => {
      setMismatchedCards([])
      mismatchFeedbackTimeoutRef.current = null
    }, MISMATCH_FEEDBACK_DURATION_MS)

    playSound('/sounds/erro.mp3')
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
    if (isPreviewing || isChecking || isTimeOver || showResultModal || card.matched || flippedCards.length === 2) {
      return
    }

    if (flippedCards.some((flippedCard) => flippedCard.id === card.id)) {
      return
    }

    const nextFlipped = [...flippedCards, card]
    setFlippedCards(nextFlipped)

    if (card.type === 'sound' && nextFlipped.length === 1) {
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
    return card.type === 'sound' && !listenedSoundCards.includes(card.id) && !isHintSoundPlaying
  }

  /**
   * Manipula clique no botão de dica sonora
   * Disponível apenas no verso da carta e apenas uma vez por carta
   * Marca a dica como usada para evitar reutilização
   * @param {Object} card - Carta para reproduzir dica
   */
  const handleSoundHintClick = (card) => {
    if (isPreviewing || isChecking || isTimeOver || showResultModal || isCardVisible(card) || !canPlaySoundHint(card)) {
      return
    }

    // lockHint ativa o bloqueio temporario de novos cliques de dica sonora.
    playSound(card.sound, { lockHint: true })
    setListenedSoundCards((current) => [...current, card.id])
  }

  /**
   * Reinicia o jogo chamando initializeGame
   */
  const restartGame = () => {
    initializeGame()
  }

  /**
   * Fecha o modal de resultado ao escolher jogar novamente.
   * Em seguida, reinicia a partida mantendo a dificuldade atual.
   */
  const restartFromModal = () => {
    setShowResultModal(false)
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

      if (matchShakeTimeoutRef.current) {
        window.clearTimeout(matchShakeTimeoutRef.current)
      }

      if (mismatchFeedbackTimeoutRef.current) {
        window.clearTimeout(mismatchFeedbackTimeoutRef.current)
      }

      clearGameTimer()
      stopCurrentAudio()
      stopTimerWarningAudio()
      setIsHintSoundPlaying(false)
    }
  }, [initializeGame])

  /**
   * Verifica se o jogo foi concluído (todas as cartas foram acertadas)
   */
  const gameFinished = useMemo(
    () => cards.length > 0 && matchedCards.length === cards.length,
    [cards.length, matchedCards.length],
  )

  /**
   * Effect: inicia o temporizador regressivo apos o fim da pre-visualizacao.
   * O tempo para de contar quando o jogo termina, quando o modal aparece ou quando o tempo acaba.
   */
  useEffect(() => {
    if (isPreviewing || gameFinished || isTimeOver || showResultModal) {
      clearGameTimer()
      return
    }

    if (timerIntervalRef.current) {
      return
    }

    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          clearGameTimer()
          stopTimerWarningAudio()
          stopCurrentAudio()
          try {
            const loseAudio = new Audio('/sounds/decepcao.mp3')
            currentAudioRef.current = loseAudio
            void loseAudio.play()
          } catch (error) {
            console.warn('Nao foi possivel reproduzir o audio de derrota:', error)
          }
          setIsTimeOver(true)
          setResultType('timeout')
          setShowResultModal(true)
          return 0
        }

        return currentTime - 1
      })
    }, 1000)

    return () => {
      clearGameTimer()
    }
  }, [isPreviewing, gameFinished, isTimeOver, showResultModal])

  useEffect(() => {
    const shouldPlayWarningNow =
      !isPreviewing &&
      !gameFinished &&
      !isTimeOver &&
      !showResultModal &&
      timeLeft === TIME_WARNING_START_SECONDS

    if (shouldPlayWarningNow) {
      playTimerWarningAudio()
    }

    const shouldForceStopWarning = isPreviewing || gameFinished || isTimeOver || showResultModal
    if (shouldForceStopWarning) {
      stopTimerWarningAudio()
    }
  }, [isPreviewing, gameFinished, isTimeOver, showResultModal, timeLeft])

  return {
    cards,
    flippedCards,
    matchedCards,
    isChecking,
    isPreviewing,
    score,
    timeLeft,
    isTimeOver,
    gameFinished,
    showResultModal,
    resultType,
    finalCuriosity,
    finalCuriosityAnimalName,
    finalCuriosityAnimalImage,
    handleCardClick,
    handleSoundHintClick,
    canPlaySoundHint,
    isCardVisible,
    shakingMatchedCards,
    mismatchedCards,
    restartGame,
    restartFromModal,
  }
}
