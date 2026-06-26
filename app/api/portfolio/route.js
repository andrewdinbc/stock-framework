import { getServerSession } from 'next-auth/next'

export async function GET(request) {
  const session = await getServerSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const mockHoldings = [
    { symbol: 'AAPL', shares: 50, avgCost: 150, currentPrice: 175.5, gainLoss: 17.0 },
    { symbol: 'MSFT', shares: 30, avgCost: 350, currentPrice: 380.2, gainLoss: 8.6 },
  ]

  return Response.json({ holdings: mockHoldings })
}