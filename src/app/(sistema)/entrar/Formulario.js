'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { entrar } from './acoes'

const entrada =
  'mono w-full rounded border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-dim/50 focus:border-verde-esc'

function Enviar() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="mono mt-5 w-full rounded border border-verde-esc bg-verde/10 px-4 py-2.5 text-sm text-verde transition hover:bg-verde/20 disabled:opacity-50"
    >
      {pending ? 'verificando…' : 'entrar'}
    </button>
  )
}

export function FormularioEntrar() {
  const [estado, acao] = useActionState(entrar, {})

  return (
    <form action={acao}>
      {estado?.erro ? (
        <p className="mono mb-5 rounded border border-vermelho/50 bg-vermelho/10 px-3 py-2.5 text-xs text-vermelho">
          ✗ {estado.erro}
        </p>
      ) : null}

      <label htmlFor="email" className="mono mb-1.5 block text-xs text-ink-dim">
        E-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="username"
        className={entrada}
      />

      <label htmlFor="senha" className="mono mt-4 mb-1.5 block text-xs text-ink-dim">
        Senha
      </label>
      <input
        id="senha"
        name="senha"
        type="password"
        required
        autoComplete="current-password"
        className={entrada}
      />

      <Enviar />
    </form>
  )
}
