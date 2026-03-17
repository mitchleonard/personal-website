import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'Mitch Leonard <hello@mail.mitchleonard.com>',
      to: 'mitch@mitchleonard.com',
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
