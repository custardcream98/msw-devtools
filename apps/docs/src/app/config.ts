import type { Locales } from "@/locales/constants"

/**
 * locale state hack for
 * html lang attribute
 *
 * does not work with SSR, but works with SSG
 */
export const state: {
  locale: Locales
} = {
  locale: "en"
}
