'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PortfolioPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/')
      return
    }
    fetchPortfolio()
  }, [session, router])

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) {
        const data = await res.json()
        setHoldings(data.holdings)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Portfolio</h1>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Add Holding
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading portfolio...</div>
        ) : holdings.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Symbol</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Shares</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Avg Cost</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Current Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Gain/Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {holdings.map((h, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{h.symbol}</td>
                    <td className="px-6 py-4">{h.shares}</td>
                    <td className="px-6 py-4">${h.avgCost}</td>
                    <td className="px-6 py-4">${h.currentPrice}</td>
                    <td className={`px-6 py-4 font-semibold ${h.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {h.gainLoss >= 0 ? '+' : ''}{h.gainLoss}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            <p className="mb-4">No holdings yet. Add your first stock to get started!</p>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Add Holding
            </button>
          </div>
        )}
      </div>
    </div>
  )
}