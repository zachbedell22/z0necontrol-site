import { sendBetaEmail, type BetaFormPayload } from '@/lib/mailer'

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function isEmail(x: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x)
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, unknown>

    // Honeypot: bots fill hidden fields; humans won't.
    const hpField = process.env.FORM_HONEYPOT_FIELD ?? 'company'
    const hpValue = typeof body[hpField] === 'string' ? (body[hpField] as string) : ''
    if (hpValue.trim().length > 0) {
      return json({ ok: true })
    }

    // Accept both our current frontend field names and future-proof names.
    const getStr = (k: string) => (typeof body[k] === 'string' ? (body[k] as string).trim() : '')

    const payload: BetaFormPayload = {
      name: getStr('name'),
      email: getStr('email'),
      phone: getStr('phone') || getStr('igOrPhone') || undefined,
      org: getStr('org') || undefined,
      location: getStr('location') || undefined,
      canopySize: getStr('canopySize') || getStr('roomSize') || undefined,
      currentStack: getStr('currentStack') || getStr('currentGear') || undefined,
      priority: getStr('priority') || undefined,
      budget: getStr('budget') || undefined,
      timeline: getStr('timeline') || undefined,
      message: getStr('message') || getStr('notes') || undefined,
    }

    if (!payload.name || payload.name.length < 2) {
      return json({ ok: false, error: 'Please provide your name.' }, 400)
    }

    if (!payload.email || !isEmail(payload.email)) {
      return json({ ok: false, error: 'Please provide a valid email.' }, 400)
    }

    await sendBetaEmail(payload)

    return json({ ok: true })
  } catch (err: any) {
    console.error('/api/beta error', err)
    // If allowlist blocks, return a friendly error.
    const msg =
      typeof err?.message === 'string' && err.message.includes('not allowed')
        ? 'That email domain is not allowed. Please use a different email.'
        : 'Server error. Try again or email us directly.'
    return json({ ok: false, error: msg }, 500)
  }
}
