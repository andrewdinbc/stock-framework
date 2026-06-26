import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'Stock Framework | Portfolio Analysis',
  description: 'Collaborative stock screening and portfolio analysis',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}