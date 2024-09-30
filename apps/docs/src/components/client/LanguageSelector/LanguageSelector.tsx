"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Locales } from "@/locales/constants"

import { Icon } from "./Icon"

const getHref = (locale: Locales) => {
  return locale === "en" ? "/" : `/${locale}`
}

export const LanguageSelector = () => {
  const pathName = usePathname()
  const currentLocale = pathName === "/" ? "en" : pathName.split("/")[1]

  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='relative'>
      <button
        title='Change language'
        type='button'
        onClick={() => {
          setIsOpen((prev) => !prev)
        }}
      >
        <Icon className='h-5 w-5 text-foreground' />
      </button>
      <ul
        role='tablist'
        className={clsx(
          "absolute right-0 mt-2 transform-gpu rounded-lg bg-background py-2 outline outline-1 outline-foreground transition-[opacity,transform]",
          isOpen
            ? "opacity-1 translate-x-0"
            : "translate-x-[calc(100%+0.5rem)] opacity-0"
        )}
      >
        {Locales.map((locale) => (
          <li key={locale}>
            <Link
              href={getHref(locale)}
              role='tab'
              className={clsx(
                "px-3 uppercase hover:bg-blue-700",
                locale === currentLocale && "bg-blue-700"
              )}
              onClick={() => {
                setIsOpen(false)
              }}
            >
              {locale}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
