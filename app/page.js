'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              SF
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Stock Framework</h1>
          </div>
          <nav className="flex gap-4 items-center">
            {session ? (
              <>
                <span className="text-sm text-gray-600">{session.user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!session ? (
          <div className="text-center py-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Collaborative Stock Analysis
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Screen stocks, analyze portfolios, and collaborate with peers
            </p>
            <button
              onClick={() => signIn('google')}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-semibold"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Quick Links */}
            <Link href="/screener">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Stock Screener</h3>
                <p className="text-gray-600">Find stocks matching your criteria</p>
              </div>
            </Link>

            <Link href="/portfolio">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio</h3>
                <p className="text-gray-600">Track and analyze your holdings</p>
              </div>
            </Link>

            <Link href="/analysis">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition">
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600">Get AI-powered stock insights</p>
              </div>
            </Link>

            <Link href="/collaborate">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg cursor-pointer transition">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborate</h3>
                <p className="text-gray-600">Share ideas with your team</p>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}