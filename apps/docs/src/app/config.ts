import type { Locales } from "@/locales/dictionaries"

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
