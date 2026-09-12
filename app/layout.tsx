import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth'
import { CartProvider } from '@/lib/cart'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'MENSGUY IMPORT LTD | Quality Products, Global Reach',
  description: 'Your trusted partner for importing quality electronics, home items, fashion, and more. Shop in-stock items or request products from overseas.',
  keywords: ['import', 'electronics', 'home goods', 'fashion', 'overseas shopping', 'installment payments'],
  authors: [{ name: 'MENSGUY IMPORT LTD' }],
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
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a5f4a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
