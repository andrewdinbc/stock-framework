import { getServerSession } from 'next-auth/next'

let ideas = []

export async function GET(request) {
  const session = await getServerSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return Response.json({ ideas })
}

export async function POST(request) {
  const session = await getServerSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { idea, symbol } = await request.json()
  if (!idea) {
    return Response.json({ error: 'Idea required' }, { status: 400 })
  }

  const newIdea = {
    id: Date.now(),
    author: session.user.name || session.user.email,
    content: idea,
    symbol,
    createdAt: new Date(),
    reactions: [],
  }

  ideas.unshift(newIdea)

  return Response.json(newIdea, { status: 201 })
}