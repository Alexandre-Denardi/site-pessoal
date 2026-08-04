'use client'

import { useEffect, useState } from 'react'

const VELOCIDADE_DIGITA = 45
const VELOCIDADE_APAGA = 22
const PAUSA_FIM = 1900

/** Efeito de digitação em loop pelas frases do perfil. */
export function Digitando({ frases = [] }) {
  const [indice, setIndice] = useState(0)
  const [texto, setTexto] = useState('')
  const [apagando, setApagando] = useState(false)

  const semAnimacao =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (frases.length === 0) return
    if (semAnimacao) {
      setTexto(frases[0])
      return
    }

    const alvo = frases[indice % frases.length]

    if (!apagando && texto === alvo) {
      const t = setTimeout(() => setApagando(true), PAUSA_FIM)
      return () => clearTimeout(t)
    }

    if (apagando && texto === '') {
      setApagando(false)
      setIndice((i) => (i + 1) % frases.length)
      return
    }

    const t = setTimeout(
      () => {
        setTexto((atual) =>
          apagando ? alvo.slice(0, atual.length - 1) : alvo.slice(0, atual.length + 1),
        )
      },
      apagando ? VELOCIDADE_APAGA : VELOCIDADE_DIGITA,
    )

    return () => clearTimeout(t)
  }, [texto, apagando, indice, frases, semAnimacao])

  if (frases.length === 0) return null

  return (
    <span className="cursor text-verde" aria-live="polite">
      {texto}
    </span>
  )
}
