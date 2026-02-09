import nodemailer from 'nodemailer'

export type BetaFormPayload = {
  name: string
  email: string
  phone?: string
  org?: string
  location?: string
  canopySize?: string
  currentStack?: string
  priority?: string
  budget?: string
  timeline?: string
  message?: string
  paidPilot?: boolean
  wantsCall?: boolean
}

function reqEnv(key: string): string {
  const v = process.env[key]
  if (!v) throw new Error(`Missing env var: ${key}`)
  return v
}

function parseBool(x: string | undefined, fallback = false) {
  if (x == null) return fallback
  const s = x.trim().toLowerCase()
  return s === 'true' || s === '1' || s === 'yes'
}

export async function sendBetaEmail(payload: BetaFormPayload) {
  const host = reqEnv('SMTP_HOST')
  const port = Number(process.env.SMTP_PORT ?? '465')
  const secure = parseBool(process.env.SMTP_SECURE, port === 465)
  const user = reqEnv('SMTP_USER')
  const pass = reqEnv('SMTP_PASS')
  const to = process.env.SMTP_TO ?? user

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  const lines: string[] = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone/IG: ${payload.phone}` : '',
    payload.org ? `Org: ${payload.org}` : '',
    payload.location ? `Location: ${payload.location}` : '',
    payload.canopySize ? `Canopy/Room: ${payload.canopySize}` : '',
    payload.currentStack ? `Current stack: ${payload.currentStack}` : '',
    payload.priority ? `Top priority: ${payload.priority}` : '',
    payload.budget ? `Budget: ${payload.budget}` : '',
    payload.timeline ? `Timeline: ${payload.timeline}` : '',
    typeof payload.paidPilot === 'boolean' ? `Interested in paid pilot: ${payload.paidPilot ? 'YES' : 'NO'}` : '',
    typeof payload.wantsCall === 'boolean' ? `Wants to book a call: ${payload.wantsCall ? 'YES' : 'NO'}` : '',
    '',
    'Message:',
    payload.message ?? '',
    '',
    '---',
    'Sent from z0necontrol.com landing page',
  ].filter(Boolean)

  const text = lines.join('\n')

  await transporter.sendMail({
    from: user,
    to,
    subject: `Z0neControl Lead — ${payload.name} (${payload.priority ?? 'Pilot'})`,
    text,
  })
}
