import type { Metadata } from 'next'
import { Inter, Noto_Serif_Devanagari, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const hindi = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['500'],
  variable: '--font-hindi',
  display: 'swap',
})

const primary = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-primary',
  display: 'swap',
})

const english = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-english',
  display: 'swap',
})

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Chull - Digital Art Gallery',
  description: 'A cinematic digital art gallery for words and images',
  keywords: ['art', 'writing', 'photography', 'literature', 'hindi', 'english'],
  authors: [{ name: 'Chull' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.variable} ${hindi.variable} ${primary.variable} ${english.variable} ${display.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}

