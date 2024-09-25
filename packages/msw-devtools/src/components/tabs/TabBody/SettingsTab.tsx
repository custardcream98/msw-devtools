import { useId } from "react"
import { useTranslation } from "react-i18next"

import { CodeEditor } from "~/components/CodeEditor"
import { useDefaultResponseSettings } from "~/components/contexts/default-response"
import { useDefaultResponseDelaySettings } from "~/components/contexts/default-response-delay"
import { useDefaultUrlSettings } from "~/components/contexts/default-url"
import { useFloatingButtonSettings } from "~/components/contexts/floating-button"
import { ScrollList } from "~/components/ScrollList"
import { useLanguage } from "~/hooks/useLanguage"
import { type Language, LANGUAGE_NAMES } from "~/lib/i18n"

export const SettingsTab = () => {
  const { defaultUrl, setDefaultUrl } = useDefaultUrlSettings()
  const { defaultResponseDelay, setDefaultResponseDelay } =
    useDefaultResponseDelaySettings()
  const { defaultResponse, setDefaultResponse } = useDefaultResponseSettings()
  const { floatingButtonOpacity, setFloatingButtonOpacity } =
    useFloatingButtonSettings()
  const { language, setLanguage } = useLanguage()

  const urlInputId = useId()
  const defaultResponseDelayId = useId()
  const defaultResponseEditorId = useId()
  const floatingButtonOpacityId = useId()
  const languageId = useId()

  const { t } = useTranslation()

  return (
    <ScrollList>
      <label htmlFor={urlInputId}>{t("tabs.settings.defaultURL.label")}</label>
      <input
        id={urlInputId}
        type='text'
        className='mt-2 w-full p-2 !font-mono msw-round-border'
        placeholder={t("tabs.settings.defaultURL.placeholder")}
        value={defaultUrl ?? ""}
        onChange={(event) => {
          event.preventDefault()

          const value = event.currentTarget.value

          setDefaultUrl(value)
        }}
      />
      <label htmlFor={defaultResponseDelayId} className='mt-4 block'>
        {t("tabs.settings.defaultResponseDelay.label")}
      </label>
      <input
        id={defaultResponseDelayId}
        type='number'
        step={0.1}
        min={0}
        className='mt-2 w-full p-2 !font-mono msw-round-border'
        value={defaultResponseDelay}
        onChange={(event) => {
          event.preventDefault()

          const value = Number(event.currentTarget.value)

          setDefaultResponseDelay(Math.max(value, 0))
        }}
      />
      <label htmlFor={defaultResponseEditorId} className='mt-4 block'>
        <span className='block'>{t("tabs.settings.responseBody.label")}</span>
        <blockquote className='blockquote mt-1 text-sm'>
          {t("tabs.settings.responseBody.description")}
        </blockquote>
      </label>
      <CodeEditor
        id={defaultResponseEditorId}
        className='mt-2 max-h-80 w-full'
        value={defaultResponse ?? ""}
        onChange={setDefaultResponse}
      />
      <label htmlFor={floatingButtonOpacityId} className='mt-4 block'>
        {t("tabs.settings.floatingButtonOpacity.label")}
      </label>
      <input
        id={floatingButtonOpacityId}
        className='mt-2 w-1/2'
        type='range'
        min={0}
        max={1}
        step={0.01}
        value={floatingButtonOpacity}
        onChange={(event) => {
          const value = Number(event.currentTarget.value)

          setFloatingButtonOpacity(value)
        }}
      />
      <label htmlFor={languageId} className='mt-4 block'>
        {t("tabs.settings.language.label")}
      </label>
      <select
        id={languageId}
        className='mt-2 p-2 msw-round-border'
        value={language}
        onChange={(event) => {
          const value = event.currentTarget.value as Language

          setLanguage(value)
        }}
      >
        {Object.entries(LANGUAGE_NAMES).map(([lang, name]) => (
          <option key={lang} value={lang}>
            {name}
          </option>
        ))}
      </select>
    </ScrollList>
  )
}
