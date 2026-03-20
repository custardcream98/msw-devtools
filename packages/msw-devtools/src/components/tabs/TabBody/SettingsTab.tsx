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
      <div className='space-y-4'>
        <div>
          <label
            htmlFor={urlInputId}
            className='text-xs font-medium text-slate-600'
          >
            {t("tabs.settings.defaultURL.label")}
          </label>
          <input
            id={urlInputId}
            type='text'
            className='mt-1.5 w-full bg-white p-2 !font-mono text-sm msw-round-border focus:outline-none focus:ring-1 focus:ring-slate-300'
            placeholder={t("tabs.settings.defaultURL.placeholder")}
            value={defaultUrl ?? ""}
            onChange={(event) => {
              event.preventDefault()
              const value = event.currentTarget.value
              setDefaultUrl(value)
            }}
          />
        </div>

        <div>
          <label
            htmlFor={defaultResponseDelayId}
            className='text-xs font-medium text-slate-600'
          >
            {t("tabs.settings.defaultResponseDelay.label")}
          </label>
          <input
            id={defaultResponseDelayId}
            type='number'
            step={0.1}
            min={0}
            className='mt-1.5 w-full bg-white p-2 !font-mono text-sm msw-round-border focus:outline-none focus:ring-1 focus:ring-slate-300'
            value={defaultResponseDelay}
            onChange={(event) => {
              event.preventDefault()
              const value = Number(event.currentTarget.value)
              setDefaultResponseDelay(Math.max(value, 0))
            }}
          />
        </div>

        <div>
          <label
            htmlFor={defaultResponseEditorId}
            className='text-xs font-medium text-slate-600'
          >
            <span className='block'>
              {t("tabs.settings.responseBody.label")}
            </span>
            <blockquote className='blockquote mt-1 text-xs text-slate-400'>
              {t("tabs.settings.responseBody.description")}
            </blockquote>
          </label>
          <CodeEditor
            id={defaultResponseEditorId}
            className='mt-1.5 max-h-80 w-full'
            value={defaultResponse ?? ""}
            onChange={setDefaultResponse}
          />
        </div>

        <div>
          <label
            htmlFor={floatingButtonOpacityId}
            className='text-xs font-medium text-slate-600'
          >
            {t("tabs.settings.floatingButtonOpacity.label")}
          </label>
          <input
            id={floatingButtonOpacityId}
            className='mt-1.5 w-1/2'
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
        </div>

        <div>
          <label
            htmlFor={languageId}
            className='text-xs font-medium text-slate-600'
          >
            {t("tabs.settings.language.label")}
          </label>
          <select
            id={languageId}
            className='mt-1.5 bg-white p-2 text-sm msw-round-border focus:outline-none focus:ring-1 focus:ring-slate-300'
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
        </div>
      </div>
    </ScrollList>
  )
}
