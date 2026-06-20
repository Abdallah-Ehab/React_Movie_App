import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from '@/i18n/translations'

const LocaleContext = createContext(null)
const SUPPORTED_LOCALES = ['en', 'ar']
const DEFAULT_LOCALE = 'en'

function getInitialLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE

  const stored = localStorage.getItem('locale')
  if (SUPPORTED_LOCALES.includes(stored)) return stored

  const browserLanguage = navigator.language?.toLowerCase() || ''
  return browserLanguage.startsWith('ar') ? 'ar' : DEFAULT_LOCALE
}

function interpolate(value, params = {}) {
  return value.replace(/\{(\w+)\}/g, (_, key) => {
    const next = params[key]
    return next === undefined || next === null ? '' : String(next)
  })
}

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale)
  const direction = locale === 'ar' ? 'rtl' : 'ltr'
  const tmdbLanguage = locale === 'ar' ? 'ar-EG' : 'en-US'

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = direction
    localStorage.setItem('locale', locale)
  }, [direction, locale])

  const setLocale = useCallback((nextLocale) => {
    if (SUPPORTED_LOCALES.includes(nextLocale)) {
      setLocaleState(nextLocale)
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState((current) => (current === 'en' ? 'ar' : 'en'))
  }, [])

  const t = useCallback((key, params) => {
    const value = translations[locale]?.[key] ?? translations.en[key] ?? key
    return interpolate(value, params)
  }, [locale])

  const value = useMemo(() => ({
    locale,
    direction,
    isRtl: direction === 'rtl',
    tmdbLanguage,
    setLocale,
    toggleLocale,
    t,
  }), [direction, locale, setLocale, t, tmdbLanguage, toggleLocale])

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
