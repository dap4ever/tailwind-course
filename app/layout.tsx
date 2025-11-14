import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Plataforma de Curso JS',
  description: 'Plataforma de estudos: JavaScript do básico ao avançado com docs e demos locais.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className + " bg-gray-50 min-h-screen"}>
        <header className="bg-blue-700 text-white p-4 mb-6 shadow">
          <nav className="container mx-auto flex items-center gap-6">
            <a href="/" className="font-bold tracking-wide">Plataforma de Curso</a>
            <a href="/curso" className="hover:underline">Curso (Interativo)</a>
            <a href="https://github.com/dap4ever/javascript-course" target="_blank" rel="noreferrer" className="hover:underline">Repositório</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
