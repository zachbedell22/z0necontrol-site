"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

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
  company: string;
};

type RoiState = {
  deploymentCost: number;
  laborRate: number;
  irrigationMode: "hand-feed" | "automated-mix" | "automated-fertigation";
  irrigationPeople: number;
  irrigationHoursPerEvent: number;
  irrigationEventsPerDay: number;
  irrigationManualHoursPerWeek: number;
  cultivationDays: number;
  dataPeople: number;
  dataHoursPerCycle: number;
  cyclesPerYear: number;
  metrcPeople: number;
  metrcHoursPerWeek: number;
  monitoringPeople: number;
  monitoringHoursPerDay: number;
  annualEnergySpend: number;
  laborCapturePercent: number;
  energySavingsPercent: number;
};

type NumericRoiKey = Exclude<keyof RoiState, "irrigationMode">;

const DEFAULT_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  org: "",
  location: "",
  canopySize: "13–40 lights / multi-room",
  currentStack: "",
  priority: "Facility demo / ROI review",
  budget: "$10,000+ commercial deployment",
  timeline: "This quarter",
  message: "",
  company: "",
};

const DEFAULT_ROI: RoiState = {
  deploymentCost: 10000,
  laborRate: 30,
  irrigationMode: "hand-feed",
  irrigationPeople: 2,
  irrigationHoursPerEvent: 1.5,
  irrigationEventsPerDay: 2,
  irrigationManualHoursPerWeek: 5,
  cultivationDays: 300,
  dataPeople: 2,
  dataHoursPerCycle: 12,
  cyclesPerYear: 6,
  metrcPeople: 1,
  metrcHoursPerWeek: 4,
  monitoringPeople: 1,
  monitoringHoursPerDay: 1.5,
  annualEnergySpend: 180000,
  laborCapturePercent: 50,
  energySavingsPercent: 2,
};

const FUNCTIONAL_GROUPS = [
  {
    title: "Sense",
    desc: "Bring room data into one normalized local truth layer.",
    items: [
      "MQTT telemetry ingestion",
      "Facility / room / zone awareness",
      "Sensor validation and quality flags",
      "Temperature, RH, VPD and derived environmental metrics",
      "Rolling environmental statistics and stability tracking",
      "Sensor replay and simulated room nodes for deterministic testing",
    ],
  },
  {
    title: "Understand",
    desc: "Convert raw readings into context instead of another wall of charts.",
    items: [
      "Grow Intelligence Engine (GIE)",
      "Canonical unit normalization",
      "Confidence-aware recommendations",
      "Target ranges instead of fake perfect setpoints",
      "Deterministic action planning",
      "Decision Trace: why a recommendation happened",
      "Replayable planning for debugging and regression review",
    ],
  },
  {
    title: "Control",
    desc: "Separate intelligence from hardware actuation so safety stays deterministic.",
    items: [
      "Zone Brain controller service",
      "Edge actuator agent",
      "Command → acknowledgement lifecycle",
      "Device heartbeat / health signals",
      "Manual override path",
      "Interlocks and conflicting-action constraints",
      "Shadow Mode for monitor-first pilots",
      "Lighting-plan compilation foundation",
    ],
  },
  {
    title: "Verify",
    desc: "Prove what happened instead of assuming a command worked.",
    items: [
      "RootView low-level truth lane",
      "CanopyView graphical truth surface",
      "ColaView secondary overlay",
      "Console monitor for telemetry / command / acknowledgement flow",
      "Canonical verification scripts",
      "Schema tests, export tests and GIE pipeline tests",
      "Deterministic end-to-end data pipeline demonstrations",
    ],
  },
  {
    title: "Record",
    desc: "Keep operational history local and queryable.",
    items: [
      "SQLite-backed local persistence",
      "Durable local event outbox",
      "Versioned EventEnvelope contract",
      "Unknown-field preservation regression coverage",
      "Queryable local cultivar memory",
      "Structured event history designed for later reporting and audit",
    ],
  },
  {
    title: "Learn",
    desc: "Connect cultivation outcomes to the room history that produced them.",
    items: [
      "Strain Intelligence database",
      "Local Strain Cards UI",
      "Grow-run and harvest outcome concepts",
      "Cultivar / lineage information",
      "Terpene and sensory information",
      "Evidence-weighted cultivar knowledge",
      "Explainable breeding-pairing utility",
      "Provider / import framework for external strain information",
    ],
  },
  {
    title: "Share — only when approved",
    desc: "Local first. Export is optional, scoped and redacted before data leaves the facility.",
    items: [
      "CloudExport arm",
      "Granular opt-in export scopes",
      "Edge-side data redaction",
      "Durable queued export",
      "Batch sender",
      "MasterDB ingest endpoint and health check",
      "Local pooled-learning development stack",
    ],
  },
  {
    title: "Integrate",
    desc: "The operating layer is designed around adapters, not one manufacturer's hardware lock-in.",
    items: [
      "Normalized message contracts",
      "Hardware-driver boundary",
      "Legacy protocol bridge",
      "MQTT transport abstraction",
      "Dry-run actuator path for safe integration work",
      "Architecture ready for lighting, irrigation, HVAC and third-party sensing adapters",
    ],
  },
];

const NEXT_FEATURES = [
  "Production-certified Grower’s Choice / Mammoth and other fixture integrations",
  "Finished automated fertigation with flow, leak and reservoir interlocks",
  "Production HVAC / dehumidifier adapters",
  "Metrc workflow automation where permitted by API and facility policy",
  "Automatic yield and cultivar outcome ingestion",
  "Camera / canopy analysis",
  "Digital-twin and what-if simulation",
  "Multi-site fleet management",
  "Peak-demand / utility optimization",
  "Fully autonomous recipe execution inside facility-approved limits",
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function number(value: number, digits = 1) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
  }).format(Number.isFinite(value) ? value : 0);
}

export default function Page() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [status, setStatus] = useState<
    | { state: "idle" }
    | { state: "submitting" }
    | { state: "ok" }
    | { state: "error"; message: string }
  >({ state: "idle" });
  const [roi, setRoi] = useState<RoiState>(DEFAULT_ROI);

  const canSubmit = useMemo(() => {
    const okName = form.name.trim().length >= 2;
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    return okName && okEmail && status.state !== "submitting";
  }, [form.name, form.email, status.state]);

  const roiResult = useMemo(() => {
    const irrigationLabor =
      roi.irrigationMode === "hand-feed"
        ? roi.irrigationPeople *
          roi.irrigationHoursPerEvent *
          roi.irrigationEventsPerDay *
          roi.cultivationDays *
          roi.laborRate
        : roi.irrigationPeople *
          roi.irrigationManualHoursPerWeek *
          52 *
          roi.laborRate;

    const cycleDataLabor =
      roi.dataPeople *
      roi.dataHoursPerCycle *
      roi.cyclesPerYear *
      roi.laborRate;

    const metrcLabor =
      roi.metrcPeople *
      roi.metrcHoursPerWeek *
      52 *
      roi.laborRate;

    const monitoringLabor =
      roi.monitoringPeople *
      roi.monitoringHoursPerDay *
      roi.cultivationDays *
      roi.laborRate;

    const currentManualLabor =
      irrigationLabor + cycleDataLabor + metrcLabor + monitoringLabor;

    const recoverableLabor =
      currentManualLabor * (roi.laborCapturePercent / 100);

    const energyValue =
      roi.annualEnergySpend * (roi.energySavingsPercent / 100);

    const annualModeledValue = recoverableLabor + energyValue;
    const netFirstYear = annualModeledValue - roi.deploymentCost;
    const roiMultiple =
      roi.deploymentCost > 0 ? annualModeledValue / roi.deploymentCost : 0;
    const paybackMonths =
      annualModeledValue > 0
        ? (roi.deploymentCost / annualModeledValue) * 12
        : 0;

    return {
      irrigationLabor,
      cycleDataLabor,
      metrcLabor,
      monitoringLabor,
      currentManualLabor,
      recoverableLabor,
      energyValue,
      annualModeledValue,
      netFirstYear,
      roiMultiple,
      paybackMonths,
    };
  }, [roi]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus({ state: "submitting" });

    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus({
          state: "error",
          message: data.error ?? "Submission failed.",
        });
        return;
      }

      setStatus({ state: "ok" });
      setForm((s) => ({ ...DEFAULT_FORM, email: s.email, name: s.name }));
    } catch {
      setStatus({ state: "error", message: "Network error. Try again." });
    }
  }

  function setRoiNumber(key: NumericRoiKey, raw: string) {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    setRoi((current) => {
      const next = { ...current };
      next[key] = parsed;
      return next;
    });
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-zinc-950 text-zinc-50">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <Image
          src="/brand/hero-grid.svg"
          alt=""
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute -top-56 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute top-40 right-[-160px] h-[520px] w-[520px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <a href="#top" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5">
              <Image src="/brand/logo.svg" alt="Z0neControl" width={28} height={28} />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">Z0neControl</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Prove · Steer · Protect
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-5 text-sm text-zinc-400 lg:flex">
            <a className="hover:text-white" href="#platform">Platform</a>
            <a className="hover:text-white" href="#features">Functional features</a>
            <a className="hover:text-white" href="#roi">ROI</a>
            <a className="hover:text-white" href="#oem">OEM / strategic fit</a>
            <a className="hover:text-white" href="#demo">Demo</a>
          </nav>

          <a
            href="#contact"
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            See the system
          </a>
        </div>
      </header>

      <section id="top" className="mx-auto max-w-7xl px-4 pb-20 pt-16 md:pt-24">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/8 px-3 py-1.5 text-xs font-medium text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Demo-ready software architecture · real facility data path
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
              The operating layer for the grow room.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Z0neControl coordinates sensing, decisions, equipment commands, verification,
              room history and cultivation intelligence without forcing the facility into one
              manufacturer&apos;s ecosystem.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#demo"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 hover:bg-zinc-200"
              >
                See what already works
              </a>
              <a
                href="#roi"
                className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Run the ROI
              </a>
            </div>

            <div className="mt-9 grid max-w-3xl gap-3 sm:grid-cols-3">
              <Metric label="Architecture" value="Local-first" note="Cloud optional" />
              <Metric label="Control posture" value="Governed" note="Plan → gate → act → verify" />
              <Metric label="Hardware posture" value="Vendor-neutral" note="Adapters, not lock-in" />
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Live system shape</div>
                  <div className="mt-1 font-semibold">Sense → Understand → Control → Verify</div>
                </div>
                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">
                  local
                </span>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4 font-mono text-xs leading-6 text-zinc-300">
                <div className="text-zinc-500">$ zonecontrol review flower_room_1</div>
                <div className="mt-3">
                  temp_f <span className="text-emerald-300">78.2</span>
                </div>
                <div>rh_pct <span className="text-emerald-300">62.1</span></div>
                <div>vpd_kpa <span className="text-emerald-300">1.18</span></div>
                <div>recommendation <span className="text-cyan-300">bounded</span></div>
                <div>authorization <span className="text-amber-300">policy gate</span></div>
                <div>command <span className="text-zinc-100">acknowledged</span></div>
                <div>event <span className="text-zinc-100">persisted</span></div>
                <div className="mt-3 text-zinc-600"># no command is considered real until the system can prove it</div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MiniCard title="Truth first" text="Measured, commanded and acknowledged state stay distinct." />
                <MiniCard title="Local resilience" text="The room is not designed around a permanent cloud dependency." />
                <MiniCard title="Safety boundary" text="Intelligence recommends. Deterministic policy authorizes." />
                <MiniCard title="Data ownership" text="Local history first; export is explicit and scoped." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="platform" className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            kicker="Platform"
            title="One room. One operational truth."
            subtitle="Most cultivation stacks are a pile of controllers, apps, spreadsheets, hand-entered logs and tribal knowledge. Z0neControl is being built as the coordinating software layer above them."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PlatformCard number="01" title="Observe" text="Normalize real sensor and device data into one room model." />
            <PlatformCard number="02" title="Decide" text="Use deterministic planning, confidence and cultivation context." />
            <PlatformCard number="03" title="Act safely" text="Route commands through explicit interlocks, approvals and edge agents." />
            <PlatformCard number="04" title="Prove" text="Record acknowledgement, observed result and durable history." />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading
          kicker="Functional feature inventory"
          title="A long list — because there is already a lot here."
          subtitle="These are implemented or demo-functional software capabilities in the canonical build. Physical-equipment integrations are not called production-ready until they are bench-validated."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {FUNCTIONAL_GROUPS.map((group) => (
            <article
              key={group.title}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{group.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{group.desc}</p>
                </div>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
                  functional
                </span>
              </div>
              <ul className="mt-5 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <details className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-6">
          <summary className="cursor-pointer list-none font-semibold">
            In integration / next — deliberately not marketed as finished
          </summary>
          <ul className="mt-5 grid gap-2 text-sm text-zinc-400 md:grid-cols-2">
            {NEXT_FEATURES.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-amber-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section id="roi" className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            kicker="Business case"
            title="The numbers have to make sense."
            subtitle="This calculator intentionally starts with boring, defensible operating costs. It does not count yield improvement, crop-loss avoidance, nutrient savings, water savings, quality improvement or peak-demand optimization."
          />

          <div className="mt-10 grid gap-8 xl:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
              <div className="grid gap-6">
                <RoiSection title="1 · System and labor">
                  <NumberInput label="Illustrative ZoneControl deployment cost" value={roi.deploymentCost} onChange={(v) => setRoiNumber("deploymentCost", v)} prefix="$" />
                  <NumberInput label="Loaded labor rate" value={roi.laborRate} onChange={(v) => setRoiNumber("laborRate", v)} prefix="$" suffix="/hr" />
                  <NumberInput label="Cultivation / operating days per year" value={roi.cultivationDays} onChange={(v) => setRoiNumber("cultivationDays", v)} suffix="days" />
                </RoiSection>

                <RoiSection title="2 · Irrigation / hand feeding">
                  <label className="grid gap-1.5 text-sm">
                    <span className="text-zinc-400">How are plants currently watered / fed?</span>
                    <select
                      value={roi.irrigationMode}
                      onChange={(e) => setRoi((s) => ({ ...s, irrigationMode: e.target.value as RoiState["irrigationMode"] }))}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none focus:border-emerald-400/40"
                    >
                      <option value="hand-feed">Hand-fed / hand-watered</option>
                      <option value="automated-mix">Automated irrigation, manual mixing / checks</option>
                      <option value="automated-fertigation">Automated fertigation</option>
                    </select>
                  </label>
                  <NumberInput label="People involved" value={roi.irrigationPeople} onChange={(v) => setRoiNumber("irrigationPeople", v)} />
                  {roi.irrigationMode === "hand-feed" ? (
                    <>
                      <NumberInput label="Hours per irrigation event" value={roi.irrigationHoursPerEvent} onChange={(v) => setRoiNumber("irrigationHoursPerEvent", v)} suffix="hrs" step="0.25" />
                      <NumberInput label="Irrigation events per day" value={roi.irrigationEventsPerDay} onChange={(v) => setRoiNumber("irrigationEventsPerDay", v)} step="0.25" />
                    </>
                  ) : (
                    <NumberInput label="Manual irrigation / mixing / checking hours per week" value={roi.irrigationManualHoursPerWeek} onChange={(v) => setRoiNumber("irrigationManualHoursPerWeek", v)} suffix="hrs/wk" step="0.5" />
                  )}
                </RoiSection>

                <RoiSection title="3 · Harvest, yield and strain data">
                  <NumberInput label="People entering / cleaning cycle data" value={roi.dataPeople} onChange={(v) => setRoiNumber("dataPeople", v)} />
                  <NumberInput label="Hours per person, per cycle" value={roi.dataHoursPerCycle} onChange={(v) => setRoiNumber("dataHoursPerCycle", v)} suffix="hrs" step="0.5" />
                  <NumberInput label="Cycles per year" value={roi.cyclesPerYear} onChange={(v) => setRoiNumber("cyclesPerYear", v)} step="0.5" />
                </RoiSection>

                <RoiSection title="4 · Metrc / compliance labor">
                  <NumberInput label="People touching Metrc / compliance entry" value={roi.metrcPeople} onChange={(v) => setRoiNumber("metrcPeople", v)} />
                  <NumberInput label="Hours per person, per week" value={roi.metrcHoursPerWeek} onChange={(v) => setRoiNumber("metrcHoursPerWeek", v)} suffix="hrs/wk" step="0.5" />
                </RoiSection>

                <RoiSection title="5 · Manual room monitoring">
                  <NumberInput label="People checking / logging rooms" value={roi.monitoringPeople} onChange={(v) => setRoiNumber("monitoringPeople", v)} />
                  <NumberInput label="Hours per person, per day" value={roi.monitoringHoursPerDay} onChange={(v) => setRoiNumber("monitoringHoursPerDay", v)} suffix="hrs/day" step="0.25" />
                </RoiSection>

                <RoiSection title="6 · Conservative capture assumptions">
                  <NumberInput label="Manual-labor value recoverable with automation" value={roi.laborCapturePercent} onChange={(v) => setRoiNumber("laborCapturePercent", v)} suffix="%" step="5" />
                  <NumberInput label="Annual lighting / HVAC / facility energy spend" value={roi.annualEnergySpend} onChange={(v) => setRoiNumber("annualEnergySpend", v)} prefix="$" step="1000" />
                  <NumberInput label="Modeled energy optimization" value={roi.energySavingsPercent} onChange={(v) => setRoiNumber("energySavingsPercent", v)} suffix="%" step="0.5" />
                </RoiSection>
              </div>
            </div>

            <aside className="xl:sticky xl:top-24 xl:self-start">
              <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-b from-emerald-400/10 to-white/[0.025] p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                  Conservative model
                </div>
                <div className="mt-5 grid gap-3">
                  <RoiLine label="Current irrigation labor" value={money(roiResult.irrigationLabor)} />
                  <RoiLine label="Cycle data-entry labor" value={money(roiResult.cycleDataLabor)} />
                  <RoiLine label="Metrc / compliance labor" value={money(roiResult.metrcLabor)} />
                  <RoiLine label="Manual monitoring labor" value={money(roiResult.monitoringLabor)} />
                  <RoiLine label="Current modeled manual labor" value={money(roiResult.currentManualLabor)} emphasis />
                </div>

                <div className="my-6 h-px bg-white/10" />

                <div className="grid gap-3">
                  <RoiLine label="Conservative recoverable labor value" value={money(roiResult.recoverableLabor)} />
                  <RoiLine label="Conservative energy value" value={money(roiResult.energyValue)} />
                  <RoiLine label="Modeled annual value" value={money(roiResult.annualModeledValue)} emphasis />
                  <RoiLine label="Illustrative deployment cost" value={money(roi.deploymentCost)} />
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <BigResult
                    label="Value / cost"
                    value={roiResult.roiMultiple > 0 ? `${number(roiResult.roiMultiple, 1)}×` : "—"}
                  />
                  <BigResult
                    label="Modeled payback"
                    value={roiResult.paybackMonths > 0 ? `${number(roiResult.paybackMonths, 1)} months` : "—"}
                  />
                  <BigResult
                    label="First-year net value"
                    value={money(roiResult.netFirstYear)}
                  />
                </div>

                <p className="mt-6 text-xs leading-5 text-zinc-500">
                  This is a planning model, not a guarantee. Change any assumption you disagree with.
                  Yield gains, avoided crop loss, water / nutrient savings, quality improvements and demand
                  management are intentionally excluded from the total above.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="oem" className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <SectionHeading
            kicker="OEM / strategic fit"
            title="Good hardware should not be trapped behind a generic controller."
            subtitle="Z0neControl can sit above a manufacturer’s fixtures or equipment as the proprietary operating layer: room intelligence, coordination, auditability, local resilience and a path to whole-facility software."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <MiniCard title="White-label / OEM" text="A manufacturer-branded operating layer without rebuilding the entire software stack from zero." />
            <MiniCard title="Deep native integration" text="Make the manufacturer’s own hardware the best-supported layer while keeping third-party compatibility." />
            <MiniCard title="Strategic pilot" text="Prove the platform in a real cultivation facility before expanding commercial scope." />
            <MiniCard title="Acquisition path" text="If the product and channel fit is strong, the conversation can become bigger than a normal software vendor relationship." />
          </div>
        </div>
      </section>

      <section id="demo" className="border-y border-white/10 bg-black/25">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <SectionHeading
            kicker="Demo-ready"
            title="We would rather show it than describe it."
            subtitle="The software/control architecture can already be demonstrated end-to-end with simulated sensing, planning, governed command flow, acknowledgement, persistence, cultivation intelligence and optional export."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <DemoCard
              title="Control loop"
              text="Sensor → MQTT → Zone Brain → GIE → command → actuator agent → acknowledgement → monitor."
            />
            <DemoCard
              title="Data loop"
              text="Event → local outbox → redacted export → ingest → SQLite persistence → query after exit."
            />
            <DemoCard
              title="Cultivation intelligence"
              text="Local Strain Cards, grow-run context, evidence-weighted cultivar knowledge and explainable breeding utility."
            />
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <Image
              src="/brand/flow.svg"
              alt="Z0neControl operating flow"
              width={1200}
              height={600}
              className="h-auto w-full opacity-95"
            />
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading
          kicker="Facility / OEM conversation"
          title="Bring the room, the hardware, or the numbers."
          subtitle="We can walk through the current demo, model your facility’s ROI, or discuss an OEM / strategic fit."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[.78fr_1.22fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <h3 className="text-lg font-semibold">What to bring</h3>
            <ul className="mt-5 grid gap-3 text-sm text-zinc-300">
              {[
                "Current lighting / controller stack",
                "Whether irrigation is automated or hand-fed",
                "Room count / canopy scale",
                "Time spent on yield / strain / cycle data entry",
                "Metrc or compliance labor",
                "Manual monitoring / logging burden",
                "Any hardware you want ZoneControl to integrate with first",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-400">
              Direct contact:{" "}
              <a className="text-zinc-100 underline decoration-white/20" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
            <div className="hidden">
              <Input label="Company" value={form.company} onChange={(v) => setForm((s) => ({ ...s, company: v }))} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Name" value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} placeholder="Your name" />
              <Input label="Email" value={form.email} onChange={(v) => setForm((s) => ({ ...s, email: v }))} placeholder="you@company.com" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Phone" value={form.phone} onChange={(v) => setForm((s) => ({ ...s, phone: v }))} placeholder="Optional" />
              <Input label="Company / facility" value={form.org} onChange={(v) => setForm((s) => ({ ...s, org: v }))} placeholder="Organization" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Location" value={form.location} onChange={(v) => setForm((s) => ({ ...s, location: v }))} placeholder="City, state" />
              <Select
                label="Scale"
                value={form.canopySize}
                onChange={(v) => setForm((s) => ({ ...s, canopySize: v }))}
                options={[
                  "1–4 lights / small room",
                  "5–12 lights / small commercial",
                  "13–40 lights / multi-room",
                  "40+ lights / facility",
                  "Manufacturer / OEM",
                ]}
              />
            </div>

            <Input
              label="Current controller / equipment stack"
              value={form.currentStack}
              onChange={(v) => setForm((s) => ({ ...s, currentStack: v }))}
              placeholder="TrolMaster, AROYA, OEM lighting controller, hand-fed irrigation, etc."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Reason for reaching out"
                value={form.priority}
                onChange={(v) => setForm((s) => ({ ...s, priority: v }))}
                options={[
                  "Facility demo / ROI review",
                  "OEM / white-label discussion",
                  "Strategic partnership",
                  "Acquisition / investment conversation",
                  "Pilot deployment",
                  "Technical integration",
                ]}
              />
              <Select
                label="Project size"
                value={form.budget}
                onChange={(v) => setForm((s) => ({ ...s, budget: v }))}
                options={[
                  "$2,500–$10,000 pilot",
                  "$10,000+ commercial deployment",
                  "Multi-room / facility scope",
                  "OEM / strategic — not a normal project budget",
                  "Not sure yet",
                ]}
              />
            </div>

            <Select
              label="Timeline"
              value={form.timeline}
              onChange={(v) => setForm((s) => ({ ...s, timeline: v }))}
              options={["This month", "Next 1–2 months", "This quarter", "Exploring strategic fit"]}
            />

            <Textarea
              label="What should we know?"
              value={form.message}
              onChange={(v) => setForm((s) => ({ ...s, message: v }))}
              placeholder="Biggest operational pain, hardware to integrate, or what you want to see in the demo."
            />

            <button
              type="submit"
              disabled={!canSubmit}
              className={`mt-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                canSubmit
                  ? "bg-white text-zinc-950 hover:bg-zinc-200"
                  : "cursor-not-allowed bg-white/15 text-zinc-500"
              }`}
            >
              {status.state === "submitting" ? "Sending…" : "Request demo / conversation"}
            </button>

            {status.state === "ok" && (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                Sent. We&apos;ll follow up directly.
              </div>
            )}
            {status.state === "error" && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                {status.message}
              </div>
            )}
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-10 text-sm text-zinc-500">
          <div>
            <div className="font-semibold text-zinc-200">Z0neControl</div>
            <div className="mt-1 text-xs">Grow Room OS · local-first · vendor-neutral · governed control</div>
          </div>
          <div className="text-xs">
            Built to prove what happened before pretending the room is automated.
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading(props: { kicker: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-4xl">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{props.kicker}</div>
      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{props.title}</h2>
      <p className="mt-4 text-base leading-7 text-zinc-400">{props.subtitle}</p>
    </div>
  );
}

function Metric(props: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{props.label}</div>
      <div className="mt-2 font-semibold">{props.value}</div>
      <div className="mt-1 text-xs text-zinc-500">{props.note}</div>
    </div>
  );
}

function MiniCard(props: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="font-semibold">{props.title}</div>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{props.text}</p>
    </div>
  );
}

function PlatformCard(props: { number: string; title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
      <div className="font-mono text-xs text-emerald-300">{props.number}</div>
      <h3 className="mt-5 text-xl font-semibold">{props.title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{props.text}</p>
    </article>
  );
}

function DemoCard(props: { title: string; text: string }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.035] p-6">
      <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-cyan-200">
        demonstrable
      </span>
      <h3 className="mt-5 text-xl font-semibold">{props.title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{props.text}</p>
    </article>
  );
}

function RoiSection(props: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-zinc-200">{props.title}</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{props.children}</div>
    </section>
  );
}

function NumberInput(props: {
  label: string;
  value: number;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
}) {
  const [raw, setRaw] = useState(String(props.value));

  useEffect(() => {
    setRaw(String(props.value));
  }, [props.value]);

  function handleChange(next: string) {
    setRaw(next);
    if (next === "" || next.endsWith(".") || next === "-") return;
    const parsed = Number(next);
    if (Number.isFinite(parsed) && parsed >= 0) props.onChange(next);
  }

  function normalizeOnBlur() {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0 || raw.trim() === "") {
      setRaw(String(props.value));
      return;
    }
    props.onChange(raw);
    setRaw(String(parsed));
  }

  return (
    <label className="grid gap-1.5 text-sm">
      <span className="text-zinc-400">{props.label}</span>
      <div className="flex items-center rounded-xl border border-white/10 bg-white/5 focus-within:border-emerald-400/40">
        {props.prefix && <span className="pl-3 text-zinc-500">{props.prefix}</span>}
        <input
          type="number"
          min="0"
          step={props.step ?? "1"}
          value={raw}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={normalizeOnBlur}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none"
        />
        {props.suffix && <span className="pr-3 text-xs text-zinc-500">{props.suffix}</span>}
      </div>
    </label>
  );
}

function RoiLine(props: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <span className="text-sm text-zinc-400">{props.label}</span>
      <strong className={props.emphasis ? "text-base text-white" : "text-sm text-zinc-200"}>{props.value}</strong>
    </div>
  );
}

function BigResult(props: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{props.label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{props.value}</div>
    </div>
  );
}

function Input(props: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-zinc-400">{props.label}</span>
      <input
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-700 focus:border-white/20"
      />
    </label>
  );
}

function Textarea(props: { label: string; value: string; placeholder?: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-zinc-400">{props.label}</span>
      <textarea
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        rows={5}
        className="resize-y rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none placeholder:text-zinc-700 focus:border-white/20"
      />
    </label>
  );
}

function Select(props: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-zinc-400">{props.label}</span>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="rounded-xl border border-white/10 bg-zinc-950 px-3 py-2.5 text-sm outline-none focus:border-white/20"
      >
        {props.options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
