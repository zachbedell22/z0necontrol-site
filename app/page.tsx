"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";

const CONTACT_EMAIL = "Z0neMaster@z0necontrol.com";

type FormState = {
  name: string;
  email: string;
  phone: string;
  org: string;
  location: string;
  canopySize: string;
  currentStack: string;
  priority: string;
  budget: string;
  timeline: string;
  message: string;
  company: string; // honeypot
};

const DEFAULTS: FormState = {
  name: "",
  email: "",
  phone: "",
  org: "",
  location: "",
  canopySize: "1–4 lights / 4x4-ish",
  currentStack: "",
  priority: "Irrigation + Monitoring",
  budget: "$500–$1,500 pilot",
  timeline: "This month",
  message: "",
  company: "",
};

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function Page() {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [status, setStatus] = useState<
    | { state: "idle" }
    | { state: "submitting" }
    | { state: "ok" }
    | { state: "error"; message: string }
  >({ state: "idle" });

  const canSubmit = useMemo(() => {
    const okName = form.name.trim().length >= 2;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    return okName && okEmail && status.state !== "submitting";
  }, [form.name, form.email, status.state]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus({ state: "submitting" });

    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          org: form.org,
          location: form.location,
          canopySize: form.canopySize,
          currentStack: form.currentStack,
          priority: form.priority,
          budget: form.budget,
          timeline: form.timeline,
          message: form.message,
          company: form.company, // honeypot
        }),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus({ state: "error", message: data.error ?? "Submission failed." });
        return;
      }

      setStatus({ state: "ok" });
      setForm((s) => ({ ...DEFAULTS, email: s.email, name: s.name }));
    } catch {
      setStatus({ state: "error", message: "Network error. Try again." });
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/brand/hero-grid.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-90"
        />
        <div className="absolute -top-48 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute top-32 right-0 h-[440px] w-[440px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Image src="/brand/logo.svg" alt="Z0neControl" width={26} height={26} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Z0neControl</div>
              <div className="text-[11px] text-zinc-400">Steer • Prove • Protect</div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a className="hover:text-white" href="#why">
              Why
            </a>
            <a className="hover:text-white" href="#how">
              How
            </a>
            <a className="hover:text-white" href="#modules">
              Modules
            </a>
            <a className="hover:text-white" href="#pilot">
              Paid pilot
            </a>
            <a className="hover:text-white" href="#faq">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hidden rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10 md:inline-flex"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href="#signup"
              className="inline-flex rounded-xl bg-white px-3 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
            >
              Get Access
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-14 md:pt-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Local-first • Truthful logging • Safety rails
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Control the room. <span className="text-zinc-300">Keep the truth.</span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300">
              Z0neControl is a modular grow-room controller + logger built to keep working when cloud
              dashboards don’t. Local data, real sensor truth, clean exports, and safety-first automation.
            </p>

            <ul className="mt-6 grid gap-3 text-sm text-zinc-200">
              {[
                "Runs even if Wi‑Fi/cloud dies (local-first by design)",
                "Truthful status: reads real sensor/state data (no guess UI)",
                "Modular control: irrigation, environment, lighting interfaces",
                "Guardrails + manual override: automation with hard limits",
                "Clean exports for analysis, reporting, and audits",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-emerald-400/90" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#signup"
                className="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
              >
                Request access
              </a>
              <a
                href="#how"
                className="inline-flex rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                See how it works
              </a>
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              No spam. No “we sold your email to a humidifier cult.”
            </p>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-200">RootView / CanopyView</div>
                <div className="text-xs text-zinc-400">truth lane → polish lane</div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-200">
                <div className="text-zinc-500">$ zonecontrol status</div>
                <div className="mt-2 grid gap-1">
                  <div>
                    vpd_kpa: <span className="text-emerald-300">1.18</span>
                  </div>
                  <div>
                    temp_f: <span className="text-emerald-300">78.2</span>
                  </div>
                  <div>
                    rh_pct: <span className="text-emerald-300">62.1</span>
                  </div>
                  <div>
                    irrigation: <span className="text-cyan-300">armed</span> (limits enforced)
                  </div>
                  <div>
                    events: <span className="text-zinc-300">queued → exported → persisted</span>
                  </div>
                </div>
                <div className="mt-3 text-zinc-500"># no guesses, no vibes — just state</div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <MiniCard title="Local-first" desc="Room keeps running even when the internet gets stupid." />
                <MiniCard title="Structured logs" desc="Events you can query, export, audit, learn from." />
                <MiniCard title="Safety rails" desc="Hard limits, interlocks, lockouts, manual override." />
                <MiniCard title="Modular control" desc="Start with irrigation + monitoring. Expand by need." />
              </div>
            </div>

            <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[28px] bg-gradient-to-r from-emerald-500/10 via-cyan-400/10 to-white/5 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          kicker="Why"
          title="Grow rooms fail quietly. Your data shouldn’t."
          subtitle="Most systems fail the same boring ways: flaky network, opaque logic, weird UI assumptions, logs that disappear. Z0neControl reduces surprises by making truth the first-class feature."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard title="Fewer mystery swings" desc="Know what happened, not what you think happened." />
          <StatCard title="Faster troubleshooting" desc="CLI diagnostics stays brutally honest." />
          <StatCard title="Less babysitting" desc="Automation with hard limits and clear behavior." />
          <StatCard title="Better repeatability" desc="Exportable, queryable history for dialing in." />
        </div>
      </section>

      {/* How */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          kicker="How"
          title="Observe → Decide → Record"
          subtitle="A simple pipeline that survives real-world chaos."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 md:items-center">
          <div className="grid gap-4 md:grid-cols-3">
            <StepCard step="01" title="Observe (Truth In)" desc="Sensor values + device states are source of truth." />
            <StepCard step="02" title="Decide (Guardrails)" desc="Rules run locally with limits, interlocks, manual mode." />
            <StepCard step="03" title="Record (Logs Out)" desc="Events are written locally and exported cleanly." />
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <Image
                src="/brand/flow.svg"
                alt="Z0neControl pipeline diagram"
                width={1200}
                height={600}
                className="h-auto w-full opacity-95"
              />
            </div>
            <div className="pointer-events-none absolute -inset-2 -z-10 rounded-[28px] bg-gradient-to-r from-emerald-500/10 via-cyan-400/10 to-white/5 blur-2xl" />
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          kicker="Modules"
          title="Modular by default"
          subtitle="Start where the ROI is highest. Expand when it earns its keep."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <ModuleCard
            title="Monitoring"
            bullets={[
              "Temp/RH/VPD, light levels, CO₂ (as applicable)",
              "Alerts, trends, structured logs",
              "Truth lane + clean dashboard lane",
            ]}
          />
          <ModuleCard
            title="Irrigation"
            bullets={[
              "Pumps / solenoids / schedules",
              "Run-time caps + lockouts",
              "Designed to prevent the classic ‘oops I flooded my room’ moment",
            ]}
          />
          <ModuleCard
            title="Environment"
            bullets={[
              "Humidification/dehumidification, fans, HVAC interfaces",
              "Do-no-harm guardrails",
              "Manual override always available",
            ]}
          />
          <ModuleCard
            title="Lighting interfaces"
            bullets={[
              "Relay / 0–10V / scheduling (depending on gear)",
              "Safety interlocks + audit trail",
              "Phase in control only after monitoring is validated",
            ]}
          />
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-300">
          <div className="font-semibold text-zinc-200">Why not just use the usual controllers?</div>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {[
              "Local-first: keeps running when Wi‑Fi is trash",
              "Truth lane vs polish lane: CLI stays honest, GUI stays clean",
              "Structured event logs: not screenshots and vibes",
              "Failsafe mindset: manual override always exists",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300/90" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-zinc-500">
            If your dashboard can’t tell you what happened when the internet died, it’s not a control system. It’s a mood ring.
          </div>
        </div>
      </section>

      {/* Paid pilot */}
      <section id="pilot" className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          kicker="Paid pilot"
          title="Want a paid pilot? Good. So do we."
          subtitle="We’re looking for a few serious operators. Paid pilot means faster build priority, tighter support, and measurable outcomes — not "
            + "a never-ending ‘beta’ where everyone ghosts."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard title="Phase 1" desc="Irrigation automation + core monitoring + logging." />
          <StatCard title="Phase 2" desc="Environment control loops + safety interlocks." />
          <StatCard title="Phase 3" desc="Steering-style rules/alerts based only on logged data." />
        </div>
      </section>

      {/* Signup */}
      <section id="signup" className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          kicker="Access"
          title="Request access (and qualify yourself)"
          subtitle="This form sends directly to our inbox. No account creation. No nonsense."
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-zinc-200">What happens next</div>
            <ul className="mt-4 grid gap-2 text-sm text-zinc-300">
              {[
                "We review your setup and priority.",
                "We reply with a proposed wiring/control map.",
                "If it’s a fit, we schedule a quick call and scope a pilot.",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-sm font-semibold text-zinc-200">Contact</div>
            <div className="mt-2 text-sm text-zinc-300">
              <a className="underline decoration-white/20 hover:decoration-white/60" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-4 text-xs text-zinc-400">
              Tip: paid pilot partners get priority builds and faster module support. Free curiosity is welcome — but paid pilots get the rocket fuel.
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <form onSubmit={handleSubmit} className="grid gap-3">
              {/* Honeypot (hidden) */}
              <div className="hidden">
                <label className="grid gap-1">
                  <span className="text-xs font-semibold text-zinc-300">Company</span>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((s) => ({ ...s, company: e.target.value }))}
                    className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm"
                    autoComplete="off"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input label="Name" value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} placeholder="Your name" />
                <Input label="Email" value={form.email} onChange={(v) => setForm((s) => ({ ...s, email: v }))} placeholder="you@domain.com" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input label="Phone (optional)" value={form.phone} onChange={(v) => setForm((s) => ({ ...s, phone: v }))} placeholder="(###) ###‑####" />
                <Input label="Org / brand" value={form.org} onChange={(v) => setForm((s) => ({ ...s, org: v }))} placeholder="Company / handle" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input label="Location" value={form.location} onChange={(v) => setForm((s) => ({ ...s, location: v }))} placeholder="City, state" />
                <Select
                  label="Canopy size"
                  value={form.canopySize}
                  onChange={(v) => setForm((s) => ({ ...s, canopySize: v }))}
                  options={[
                    "1–4 lights / 4x4-ish",
                    "5–12 lights / small room",
                    "13–40 lights / multi-room",
                    "40+ lights / facility",
                  ]}
                />
              </div>

              <Input
                label="Current controller / stack"
                value={form.currentStack}
                onChange={(v) => setForm((s) => ({ ...s, currentStack: v }))}
                placeholder="TrolMaster / AC Infinity / DIY / none / etc."
              />

              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  label="Top priority"
                  value={form.priority}
                  onChange={(v) => setForm((s) => ({ ...s, priority: v }))}
                  options={[
                    "Irrigation + Monitoring",
                    "Environment control loops",
                    "Lighting control",
                    "Just logging / analytics first",
                  ]}
                />
                <Select
                  label="Pilot budget"
                  value={form.budget}
                  onChange={(v) => setForm((s) => ({ ...s, budget: v }))}
                  options={["$500–$1,500 pilot", "$1,500–$5,000 pilot", "$5,000+ (facility)", "Not sure yet"]}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Select
                  label="Timeline"
                  value={form.timeline}
                  onChange={(v) => setForm((s) => ({ ...s, timeline: v }))}
                  options={["This month", "Next 1–2 months", "This quarter", "Just exploring"]}
                />
                <div />
              </div>

              <Textarea
                label="Notes"
                value={form.message}
                onChange={(v) => setForm((s) => ({ ...s, message: v }))}
                placeholder="Biggest pain point? What would success look like in 30 days?"
              />

              <button
                type="submit"
                disabled={!canSubmit}
                className={cx(
                  "mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                  canSubmit ? "bg-white text-zinc-950 hover:bg-zinc-200" : "bg-white/20 text-zinc-300 cursor-not-allowed"
                )}
              >
                {status.state === "submitting" ? "Submitting..." : "Request access"}
              </button>

              {status.state === "ok" && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  Sent. We’ll reply with a wiring/control map if it’s a fit.
                </div>
              )}

              {status.state === "error" && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {status.message}
                </div>
              )}

              <div className="text-xs text-zinc-500">
                This stores nothing on the site — it just emails your answers. (For now.)
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading
          kicker="FAQ"
          title="Questions you’re already thinking"
          subtitle="Short answers. No marketing fog machine."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Faq q="Does it work without internet?" a="Yes. That’s the point. Cloud is optional." />
          <Faq q="Is this a full controller replacement?" a="That’s the direction. We start modular and prove it in the room." />
          <Faq q="What’s the recommended first phase?" a="Monitoring + irrigation automation (fast ROI, easy to validate safely)." />
          <Faq q="Where does my data go?" a="Local by default. Export only when you choose." />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-zinc-400">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-white/5">
                <Image src="/brand/logo.svg" alt="Z0neControl" width={26} height={26} />
              </div>
              <div>
                <div className="font-semibold text-zinc-200">Z0neControl</div>
                <div className="text-xs">Local-first grow control + logging</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a className="hover:text-white" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
              <a className="hover:text-white" href="#signup">
                Access
              </a>
            </div>
          </div>

          <div className="mt-6 text-xs text-zinc-600">Built for rooms that don’t forgive mistakes. Also built for humans who want to sleep.</div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading(props: { kicker: string; title: string; subtitle: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{props.kicker}</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{props.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300">{props.subtitle}</p>
    </div>
  );
}

function MiniCard(props: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold text-zinc-200">{props.title}</div>
      <div className="mt-1 text-xs text-zinc-400">{props.desc}</div>
    </div>
  );
}

function StatCard(props: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm font-semibold text-zinc-200">{props.title}</div>
      <div className="mt-2 text-sm text-zinc-400">{props.desc}</div>
    </div>
  );
}

function StepCard(props: { step: string; title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs font-semibold text-zinc-500">{props.step}</div>
      <div className="mt-2 text-lg font-semibold text-zinc-100">{props.title}</div>
      <div className="mt-2 text-sm leading-relaxed text-zinc-300">{props.desc}</div>
    </div>
  );
}

function ModuleCard(props: { title: string; bullets: string[] }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-lg font-semibold text-zinc-100">{props.title}</div>
      <ul className="mt-4 grid gap-2 text-sm text-zinc-300">
        {props.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300/90" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Faq(props: { q: string; a: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm font-semibold text-zinc-200">{props.q}</div>
      <div className="mt-2 text-sm text-zinc-300">{props.a}</div>
    </div>
  );
}

function Input(props: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-zinc-300">{props.label}</span>
      <input
        className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/20"
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

function Textarea(props: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-zinc-300">{props.label}</span>
      <textarea
        className="min-h-[88px] resize-y rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-white/20"
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}

function Select(props: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-semibold text-zinc-300">{props.label}</span>
      <select
        className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-white/20"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((o) => (
          <option key={o} value={o} className="bg-zinc-950">
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}