import { Carousel } from "@/components/client/Carousel"
import { Anchor } from "@/components/server/Anchor"
import type { Locales } from "@/locales/constants"
import { getDictionary } from "@/locales/dictionaries"

const CAROUSEL_IMAGES = {
  en: () => import("@/components/client/Carousel/assets/en"),
  ko: () => import("@/components/client/Carousel/assets/ko")
}

export async function Docs({ locale }: { locale: Locales }) {
  const dictionary = await getDictionary(locale)

  return (
    <div className='flex min-h-screen flex-col'>
      <header className='flex h-[20vh] flex-col items-center justify-end px-4 text-center sm:h-[15vh] xl:p-0'>
        <h1 className='text-xl text-white sm:text-2xl'>
          @custardcream/msw-devtools
        </h1>
        <p className='mt-3 text-sm sm:text-base'>{dictionary.description}</p>
      </header>
      <main className='mx-auto flex flex-1 flex-col items-center justify-center px-4 xl:max-w-7xl xl:p-0'>
        <section>
          <h2 className='sr-only'>{dictionary.sections.screenshots.title}</h2>
          <Carousel
            widthClassName='w-full sm:w-[600px]'
            className='mx-auto'
            images={(await CAROUSEL_IMAGES[locale]()).default}
            i18n={{
              locale: "en",
              ...dictionary.sections.screenshots.carousel
            }}
          />
        </section>
        <section className='mt-20 flex flex-col items-center text-sm sm:text-base'>
          <h2 className='sr-only'>{dictionary.sections.sitemap.title}</h2>
          <ul className='mt-2 flex flex-wrap justify-center gap-5 text-base sm:text-lg'>
            <li>
              <Anchor
                href='https://github.com/custardcream98/msw-devtools'
                target='_blank'
                rel='noreferrer noopener'
              >
                README
              </Anchor>
            </li>
            <li>
              <Anchor
                href='https://msw-devtools.vercel.app/'
                target='_blank'
                rel='noreferrer noopener'
              >
                {dictionary.sections.sitemap.link.react}
              </Anchor>
            </li>
            <li>
              <Anchor
                href='https://msw-devtools-vue.vercel.app/'
                target='_blank'
                rel='noreferrer noopener'
              >
                {dictionary.sections.sitemap.link.vue}
              </Anchor>
            </li>
          </ul>
        </section>
      </main>
      <footer className='fixed bottom-0 left-0'>
        <small className='text-xs text-gray-400'>
          © 2024 Shi Woo, Park (custardcream98). All rights reserved.
        </small>
      </footer>
    </div>
  )
}
