/**
 * /api/chat — Placeholder API route for future AI chatbot integration
 *
 * Intended integration:
 * - Supabase vector store: case study data, CV content, and project descriptions
 *   will be embedded and stored as pgvector records for semantic retrieval.
 * - Anthropic Claude API: user messages will be augmented with retrieved context
 *   (RAG pattern) and sent to Claude for response generation.
 * - Auth: lightweight session or rate-limit logic to prevent abuse.
 *
 * This route is a placeholder. Do not build the chatbot here — this comment
 * documents the intended architecture for future implementation.
 *
 * Environment variables needed (add to .env.local):
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - ANTHROPIC_API_KEY
 */

import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    message: 'Chatbot coming soon. Trained on Mitch\'s case studies and background.',
  })
}
