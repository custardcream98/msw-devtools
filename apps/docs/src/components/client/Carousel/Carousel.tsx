"use client"

import clsx from "clsx"
import Image, { type ImageProps } from "next/image"
import { useState } from "react"

import type { Locales } from "@/locales/constants"

export const Carousel = ({
  widthClassName,
  className,
  images,
  i18n
}: {
  widthClassName?: string
  className?: string
  images: ImageProps["src"][]
  i18n: {
    locale: Locales
    imageAlt: string
    buttonImageAlt: string
  }
}) => {
  const [focusedIndex, setFocusedIndex] = useState(0)

  return (
    <div className={clsx(widthClassName, className)}>
      <div className='overflow-hidden rounded-lg'>
        <div
          className='flex translate-x-[var(--x)] transform-gpu transition-transform'
          style={{
            "--x": `calc(-${focusedIndex} * 100%)`
          }}
        >
          {images.map((src, index) => (
            <CarouselImage
              key={index}
              className={clsx("shrink-0", widthClassName)}
              src={src}
              alt={`${i18n.imageAlt} ${index + 1}`}
            />
          ))}
        </div>
      </div>
      <div className='mt-2 flex gap-2'>
        {images.map((src, index) => (
          <button className='w-full' key={index}>
            <CarouselImage
              className={clsx(
                focusedIndex === index &&
                  "border-[3px] border-solid border-blue-500"
              )}
              src={src}
              alt={`${i18n.imageAlt} ${index + 1} ${i18n.buttonImageAlt}`}
              onClick={() => setFocusedIndex(index)}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

const CarouselImage = ({ className, alt, ...props }: ImageProps) => {
  return (
    <Image
      className={clsx(className, "rounded-lg")}
      sizes='(max-width: 1280px) 50vw, 100vw'
      quality={100}
      loading='eager'
      alt={alt}
      {...props}
    />
  )
}
