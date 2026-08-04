'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { configurarBanco, criarAdministrador } from './acoes'

const entrada =
  'mono w-full rounded border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-dim/50 focus:border-verde-esc'

function Rotulo({ children, para }) {
  return (
    <label htmlFor={para} className="mono mb-1.5 block text-xs text-ink-dim">
      {children}
    </label>
  )
}

function Erro({ mensagem }) {
  if (!mensagem) return null

  return (
    <p className="mono mb-5 rounded border border-vermelho/50 bg-vermelho/10 px-3 py-2.5 text-xs leading-relaxed text-vermelho">
      ✗ {mensagem}
    </p>
  )
}

function Enviar({ rotulo, carregando }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="mono mt-2 w-full rounded border border-verde-esc bg-verde/10 px-4 py-2.5 text-sm text-verde transition hover:bg-verde/20 disabled:opacity-50"
    >
      {pending ? carregando : rotulo}
    </button>
  )
}

export function FormularioBanco() {
  const [estado, acao] = useActionState(configurarBanco, {})
  const v = estado?.valores ?? {}

  return (
    <form action={acao}>
      <Erro mensagem={estado?.erro} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Rotulo para="host">Host do MySQL</Rotulo>
          <input
            id="host"
            name="host"
            defaultValue={v.host ?? ''}
            placeholder="ex.: mysql.discloud.app"
            required
            className={entrada}
          />
        </div>

        <div>
          <Rotulo para="port">Porta</Rotulo>
          <input id="port" name="port" type="number" defaultValue={v.port ?? 3306} className={entrada} />
        </div>
      </div>

      <div className="mt-4">
        <Rotulo para="database">Banco de dados</Rotulo>
        <input
          id="database"
          name="database"
          defaultValue={v.database ?? ''}
          placeholder="nome do schema já existente"
          required
          className={entrada}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Rotulo para="username">Usuário</Rotulo>
          <input
            id="username"
            name="username"
            defaultValue={v.username ?? ''}
            required
            autoComplete="off"
            className={entrada}
          />
        </div>

        <div>
          <Rotulo para="password">Senha</Rotulo>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className={entrada}
          />
        </div>
      </div>

      <p className="mono mt-4 text-xs leading-relaxed text-ink-dim">
        O usuário precisa poder criar tabelas nesse banco — as tabelas do site são criadas agora.
      </p>

      <Enviar rotulo="testar conexão e continuar" carregando="conectando…" />
    </form>
  )
}

export function FormularioAdmin() {
  const [estado, acao] = useActionState(criarAdministrador, {})

  return (
    <form action={acao}>
      <Erro mensagem={estado?.erro} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Rotulo para="nome">Nome</Rotulo>
          <input id="nome" name="nome" required className={entrada} />
        </div>

        <div>
          <Rotulo para="email">E-mail</Rotulo>
          <input id="email" name="email" type="email" required autoComplete="username" className={entrada} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Rotulo para="senha">Senha</Rotulo>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={entrada}
          />
        </div>

        <div>
          <Rotulo para="confirmar">Confirmar senha</Rotulo>
          <input
            id="confirmar"
            name="confirmar"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className={entrada}
          />
        </div>
      </div>

      <p className="mono mt-4 text-xs text-ink-dim">Mínimo de 8 caracteres.</p>

      <Enviar rotulo="criar administrador e entrar" carregando="criando…" />
    </form>
  )
}
