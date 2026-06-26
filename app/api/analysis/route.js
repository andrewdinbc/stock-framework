import { Anthropic } from '@anthropic-ai/sdk'
import { getServerSession } from 'next-auth/next'

const client = new Anthropic()

export async function POST(request) {
  const session = await getServerSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { symbol } = await request.json()
  if (!symbol) {
    return Response.json({ error: 'Symbol required' }, { status: 400 })
  }

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Provide a brief investment analysis for ${symbol}. Include key metrics, strengths, and risks. Format as structured bullet points.`,
        },
      ],
    })

    const analysis = message.content[0].type === 'text' ? message.content[0].text : ''

    return Response.json({
      symbol,
      analysis,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return Response.json(
      { error: 'Analysis failed', details: error.message },
      { status: 500 }
    )
  }
}