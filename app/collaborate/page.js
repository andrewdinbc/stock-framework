'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CollaboratePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [ideas, setIdeas] = useState([])
  const [newIdea, setNewIdea] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/')
      return
    }
    fetchIdeas()
  }, [session, router])

  const fetchIdeas = async () => {
    try {
      const res = await fetch('/api/ideas')
      if (res.ok) {
        const data = await res.json()
        setIdeas(data.ideas || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const submitIdea = async (e) => {
    e.preventDefault()
    if (!newIdea.trim()) return

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: newIdea, symbol: '' }),
      })
      if (res.ok) {
        setNewIdea('')
        fetchIdeas()
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Team Ideas</h1>

        {/* Submit Idea */}
        <form onSubmit={submitIdea} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <textarea
            placeholder="Share your stock idea or market insight..."
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
            rows="4"
          />
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Share Idea
          </button>
        </form>

        {/* Ideas List */}
        {loading ? (
          <div className="text-center py-12">Loading ideas...</div>
        ) : ideas.length > 0 ? (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div key={idea.id} className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm">{idea.author} • {new Date(idea.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-900 mt-2">{idea.content}</p>
                <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-gray-700">
                    <strong>How could you show your learning?</strong> 
                    Write a response, create a comparison, or develop this idea further. 
                    Choose the format that works best for you.
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-600">
            No ideas yet. Be the first to share!
          </div>
        )}
      </div>
    </div>
  )
}