export async function POST(request) {
  const { minPrice, maxPrice, minPE, maxPE } = await request.json()

  // Mock data - replace with real API calls
  const mockStocks = [
    { symbol: 'AAPL', price: 175.5, pe: 28.4 },
    { symbol: 'MSFT', price: 380.2, pe: 35.1 },
    { symbol: 'GOOGL', price: 140.3, pe: 24.6 },
    { symbol: 'AMZN', price: 170.8, pe: 60.2 },
    { symbol: 'TSLA', price: 242.5, pe: 68.3 },
    { symbol: 'META', price: 485.2, pe: 28.9 },
    { symbol: 'NVDA', price: 875.3, pe: 65.4 },
  ]

  const filtered = mockStocks.filter((stock) => {
    if (minPrice && stock.price < parseFloat(minPrice)) return false
    if (maxPrice && stock.price > parseFloat(maxPrice)) return false
    if (minPE && stock.pe < parseFloat(minPE)) return false
    if (maxPE && stock.pe > parseFloat(maxPE)) return false
    return true
  })

  return Response.json({ stocks: filtered })
}