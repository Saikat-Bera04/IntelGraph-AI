import React from "react"
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { GeistPixelLine } from 'geist/font/pixel'
import { Analytics } from '@vercel/analytics/next'
import { ConvexClientProvider } from "@/components/ConvexClientProvider"
import { ErrorBoundary } from "@/components/error-boundary"
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: 'IntelGraph AI - GraphRAG Cybersecurity Platform',
  description: 'GraphRAG-powered cybersecurity investigation platform that analyzes attack chains using multi-hop graph reasoning.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${GeistPixelLine.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <ConvexClientProvider>
            {children}
            <Analytics />
          </ConvexClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
