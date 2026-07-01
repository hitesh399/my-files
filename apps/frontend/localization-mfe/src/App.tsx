import { useEffect, useState } from 'react'
import {
  APP_ID,
  DEFAULT_LOCALE,
  LOCALES,
  getPersistedLocale,
  onContextRequest,
  onLanguageChange,
  persistLanguage,
  publishContextSnapshot,
  publishLanguageChange,
  readPersistedTheme,
  type LocaleName,
} from './platformContextBus'
import './App.css'

function App() {
  const [language, setLanguage] = useState<LocaleName>(
    () => getPersistedLocale() ?? DEFAULT_LOCALE,
  )

  useEffect(() => {
    const unsubscribeRequest = onContextRequest(({ source }) => {
      if (source === APP_ID) {
        return
      }

      publishContextSnapshot({
        source: APP_ID,
        theme: readPersistedTheme(),
        language,
      })
    })

    const unsubscribeLanguage = onLanguageChange(({ source, language: nextLanguage }) => {
      if (source === APP_ID || !LOCALES.includes(nextLanguage)) {
        return
      }

      setLanguage(nextLanguage)
    })

    return () => {
      unsubscribeRequest()
      unsubscribeLanguage()
    }
  }, [language])

  useEffect(() => {
    persistLanguage(language)
    publishLanguageChange({ source: APP_ID, language })
  }, [language])

  return (
    <main className="container">
      <p className="eyebrow">Shell Runtime Controller</p>
      <h1>Localization MFE</h1>
      <p className="description">
        This remote owns the global language and synchronizes all MFEs through platform-context/v1 events.
      </p>

      <label htmlFor="language-select">Global language</label>
      <select
        id="language-select"
        value={language}
        onChange={(event) => setLanguage(event.target.value as LocaleName)}
      >
        {LOCALES.map((entry) => (
          <option key={entry} value={entry}>
            {entry}
          </option>
        ))}
      </select>
    </main>
  )
}

export default App
