import type { Locale } from './i18n'

const BCP47: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en-US',
  ja: 'ja-JP',
  ko: 'ko-KR',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
}

const JUST_NOW: Record<Locale, string> = {
  zh: '刚刚',
  en: 'just now',
  ja: 'たった今',
  ko: '방금',
  es: 'ahora mismo',
  fr: "à l'instant",
  de: 'gerade eben',
}

const CTX_TOKEN_SUFFIX: Record<Locale, string> = {
  zh: '上下文 token',
  en: 'ctx tok',
  ja: 'コンテキストトークン',
  ko: '컨텍스트 토큰',
  es: 'tok. de contexto',
  fr: 'tok. de contexte',
  de: 'Kontext-Tokens',
}

/** 会话列表 / 回放副标题所需的 store 元数据字段 */
export interface SessionMetaSubtitleFields {
  storeChannel?: string
  storeProvider?: string
  storeModel?: string
  storeContextTokens?: number
}

export function sessionMetaSubtitle(s: SessionMetaSubtitleFields, locale: Locale): string | null {
  const parts: string[] = []
  if (s.storeChannel?.trim()) parts.push(s.storeChannel.trim())
  const prov = s.storeProvider?.trim()
  if (prov && prov !== s.storeChannel?.trim()) parts.push(prov)
  if (s.storeModel?.trim()) parts.push(s.storeModel.trim())
  if (typeof s.storeContextTokens === 'number' && s.storeContextTokens > 0) {
    const suffix = CTX_TOKEN_SUFFIX[locale] ?? CTX_TOKEN_SUFFIX.en
    parts.push(`~${s.storeContextTokens.toLocaleString(BCP47[locale])} ${suffix}`)
  }
  return parts.length ? parts.join(' · ') : null
}

export function formatRelativeTime(dateStr: string, locale: Locale): string {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const tag = BCP47[locale]
  if (diffMs < 0) return new Date(dateStr).toLocaleDateString(tag)

  const minutes = Math.floor(diffMs / 60000)
  const rtf = new Intl.RelativeTimeFormat(tag, { numeric: 'auto' })

  if (minutes < 1) return JUST_NOW[locale] ?? JUST_NOW.en
  if (minutes < 60) return rtf.format(-minutes, 'minute')

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return rtf.format(-hours, 'hour')

  const days = Math.floor(hours / 24)
  if (days < 30) return rtf.format(-days, 'day')

  return new Date(dateStr).toLocaleDateString(tag)
}

export function formatDuration(ms: number, locale: Locale): string {
  const sec = Math.floor(ms / 1000)
  const m = Math.floor(sec / 60)
  const s = sec % 60

  switch (locale) {
    case 'en':
      if (sec < 60) return `${sec}s`
      return `${m}m ${s}s`
    case 'zh':
      if (sec < 60) return `${sec}秒`
      return `${m}分${s}秒`
    case 'ja':
      if (sec < 60) return `${sec}秒`
      return `${m}分${s}秒`
    case 'ko':
      if (sec < 60) return `${sec}초`
      return `${m}분 ${s}초`
    case 'es':
    case 'fr':
      if (sec < 60) return `${sec} s`
      return `${m} min ${s} s`
    case 'de':
      if (sec < 60) return `${sec} Sek.`
      return `${m} Min. ${s} Sek.`
    default:
      if (sec < 60) return `${sec}s`
      return `${m}m ${s}s`
  }
}
