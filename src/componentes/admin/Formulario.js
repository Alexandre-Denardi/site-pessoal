'use client'

import { marked } from 'marked'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'

const LARGURA = {
  metade: 'sm:col-span-1',
  inteira: 'sm:col-span-2',
}

function Rotulo({ campo }) {
  return (
    <label htmlFor={campo.nome} className="mono mb-1.5 block text-xs text-ink-dim">
      {campo.rotulo}
      {campo.obrigatorio ? <span className="ml-1 text-verde">*</span> : null}
    </label>
  )
}

function Ajuda({ campo }) {
  if (!campo.ajuda) return null
  return <p className="mt-1.5 text-xs text-ink-dim/80">{campo.ajuda}</p>
}

const entrada =
  'mono w-full rounded border border-line bg-surface-2 px-3 py-2 text-sm text-ink outline-none transition placeholder:text-ink-dim/50 focus:border-verde-esc'

function CampoMarkdown({ campo, valorInicial }) {
  const [texto, setTexto] = useState(valorInicial ?? '')
  const [preview, setPreview] = useState(false)

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <Rotulo campo={campo} />
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="mono rounded border border-line px-2 py-0.5 text-[0.7rem] text-ink-dim transition hover:border-verde-esc hover:text-verde"
        >
          {preview ? 'editar' : 'prévia'}
        </button>
      </div>

      {preview ? (
        <div
          className="prosa min-h-56 rounded border border-line bg-surface-2 px-4 py-3"
          dangerouslySetInnerHTML={{ __html: marked.parse(texto || '_(vazio)_') }}
        />
      ) : (
        <textarea
          id={campo.nome}
          name={campo.nome}
          rows={14}
          defaultValue={valorInicial ?? ''}
          onChange={(e) => setTexto(e.target.value)}
          required={campo.obrigatorio}
          className={`${entrada} resize-y leading-relaxed`}
          placeholder="Markdown: ## título, **negrito**, `código`, - listas…"
        />
      )}

      <Ajuda campo={campo} />
    </div>
  )
}

function CampoRepetivel({ campo, valorInicial }) {
  const [linhas, setLinhas] = useState(
    Array.isArray(valorInicial) && valorInicial.length > 0 ? valorInicial : [],
  )

  const atualizar = (indice, chave, valor) => {
    setLinhas((atual) =>
      atual.map((linha, i) => (i === indice ? { ...linha, [chave]: valor } : linha)),
    )
  }

  const adicionar = () =>
    setLinhas((atual) => [...atual, Object.fromEntries(campo.subcampos.map((s) => [s.nome, '']))])

  const remover = (indice) => setLinhas((atual) => atual.filter((_, i) => i !== indice))

  return (
    <div>
      <Rotulo campo={campo} />
      <input type="hidden" name={campo.nome} value={JSON.stringify(linhas)} />

      <div className="space-y-2">
        {linhas.map((linha, indice) => (
          <div key={indice} className="flex items-center gap-2">
            {campo.subcampos.map((sub) => (
              <input
                key={sub.nome}
                type="text"
                value={linha[sub.nome] ?? ''}
                placeholder={sub.rotulo}
                onChange={(e) => atualizar(indice, sub.nome, e.target.value)}
                className={entrada}
              />
            ))}
            <button
              type="button"
              onClick={() => remover(indice)}
              aria-label="Remover linha"
              className="mono shrink-0 rounded border border-line px-2.5 py-2 text-xs text-ink-dim transition hover:border-vermelho hover:text-vermelho"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={adicionar}
        className="mono mt-2 rounded border border-line px-3 py-1.5 text-xs text-ink-dim transition hover:border-verde-esc hover:text-verde"
      >
        + adicionar
      </button>

      <Ajuda campo={campo} />
    </div>
  )
}

function Campo({ campo, valor, midias }) {
  switch (campo.tipo) {
    case 'markdown':
      return <CampoMarkdown campo={campo} valorInicial={valor} />

    case 'repetivel':
      return <CampoRepetivel campo={campo} valorInicial={valor} />

    case 'booleano':
      return (
        <label className="mono flex cursor-pointer items-center gap-2.5 py-2 text-sm text-ink">
          <input
            type="checkbox"
            name={campo.nome}
            defaultChecked={Boolean(valor)}
            className="size-4 accent-[var(--verde)]"
          />
          {campo.rotulo}
        </label>
      )

    case 'textarea':
      return (
        <div>
          <Rotulo campo={campo} />
          <textarea
            id={campo.nome}
            name={campo.nome}
            rows={3}
            defaultValue={valor ?? ''}
            required={campo.obrigatorio}
            maxLength={campo.maxLength}
            className={`${entrada} resize-y`}
          />
          <Ajuda campo={campo} />
        </div>
      )

    case 'lista':
      return (
        <div>
          <Rotulo campo={campo} />
          <textarea
            id={campo.nome}
            name={campo.nome}
            rows={4}
            defaultValue={Array.isArray(valor) ? valor.join('\n') : ''}
            className={`${entrada} resize-y`}
          />
          <Ajuda campo={campo} />
        </div>
      )

    case 'select':
      return (
        <div>
          <Rotulo campo={campo} />
          <select
            id={campo.nome}
            name={campo.nome}
            defaultValue={valor ?? campo.padrao ?? ''}
            className={entrada}
          >
            {campo.opcoes.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
          <Ajuda campo={campo} />
        </div>
      )

    case 'midia':
      return (
        <div>
          <Rotulo campo={campo} />
          <select id={campo.nome} name={campo.nome} defaultValue={valor ?? ''} className={entrada}>
            <option value="">— nenhum —</option>
            {midias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.alt || m.nomeOriginal || m.arquivo}
              </option>
            ))}
          </select>
          <Ajuda campo={campo} />
        </div>
      )

    case 'data':
      return (
        <div>
          <Rotulo campo={campo} />
          <input
            id={campo.nome}
            name={campo.nome}
            type="date"
            defaultValue={valor ?? ''}
            required={campo.obrigatorio}
            className={entrada}
          />
          <Ajuda campo={campo} />
        </div>
      )

    case 'numero':
      return (
        <div>
          <Rotulo campo={campo} />
          <input
            id={campo.nome}
            name={campo.nome}
            type="number"
            defaultValue={valor ?? campo.padrao ?? ''}
            className={entrada}
          />
          <Ajuda campo={campo} />
        </div>
      )

    default:
      return (
        <div>
          <Rotulo campo={campo} />
          <input
            id={campo.nome}
            name={campo.nome}
            type="text"
            defaultValue={valor ?? ''}
            required={campo.obrigatorio}
            maxLength={campo.maxLength}
            className={entrada}
          />
          <Ajuda campo={campo} />
        </div>
      )
  }
}

function Botoes({ voltarPara }) {
  const { pending } = useFormStatus()

  return (
    <div className="sticky bottom-0 -mx-6 mt-8 flex items-center gap-3 border-t border-line bg-surface/95 px-6 py-4 backdrop-blur">
      <button
        type="submit"
        disabled={pending}
        className="mono rounded border border-verde-esc bg-verde/10 px-4 py-2 text-sm text-verde transition hover:bg-verde/20 disabled:opacity-50"
      >
        {pending ? 'salvando…' : 'salvar'}
      </button>
      <Link
        href={voltarPara}
        className="mono rounded border border-line px-4 py-2 text-sm text-ink-dim transition hover:border-verde-esc hover:text-verde"
      >
        cancelar
      </Link>
    </div>
  )
}

export function Formulario({ campos, valores = {}, acao, voltarPara, midias = [] }) {
  const [estado, enviar] = useActionState(acao, {})

  // Se a gravação falhou, reexibe o que foi digitado em vez do que veio do banco.
  const atuais = estado?.valores ?? valores

  return (
    <form
      action={enviar}
      // Remonta os campos ao voltar do erro para que os valores digitados apareçam.
      key={estado?.tentativa ?? 'inicial'}
      className="cartao p-6"
    >
      {estado?.erro ? (
        <p className="mono mb-6 rounded border border-vermelho/50 bg-vermelho/10 px-3 py-2.5 text-xs leading-relaxed text-vermelho">
          ✗ {estado.erro}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        {campos.map((campo) => (
          <div key={campo.nome} className={LARGURA[campo.largura] ?? LARGURA.inteira}>
            <Campo campo={campo} valor={atuais[campo.nome]} midias={midias} />
          </div>
        ))}
      </div>

      <Botoes voltarPara={voltarPara} />
    </form>
  )
}
