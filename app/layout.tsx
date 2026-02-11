import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'DermaLabs SkinScan - Track Your Skin Health',
  description: 'Perform weekly facial scans and track skin metrics over time using Haut.AI analysis.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-clinical-neutral">
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
