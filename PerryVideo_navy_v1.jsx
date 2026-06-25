// PerryVideo.jsx — "Fund Independence From Law Firms" explainer
// Self-contained: compact timeline engine + scenes. Mounted via <x-import>.

// ── palette / type ──────────────────────────────────────────────────────────
const NAVY   = '#F6F4EF';
const NAVY_D = '#EDE9E2';
const PANEL  = '#FFFFFF';
const INK    = '#0B1E36';
const MUTE   = 'rgba(11,30,54,0.55)';
const FAINT  = 'rgba(11,30,54,0.10)';
const GOLD   = '#C9A75E';
const RUST   = 'hsla(172, 64%, 31%, 1)';
const SERIF  = "'Spectral', Georgia, 'Times New Roman', serif";
const MONO   = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

// ── easing / math ───────────────────────────────────────────────────────────
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const Easing = {
  linear: t => t,
  outCubic: t => (--t) * t * t + 1,
  inCubic:  t => t * t * t,
  outQuart: t => 1 - (--t) * t * t * t,
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};
function interpolate(input, output, ease = Easing.linear) {
  return t => {
    if (t <= input[0]) return output[0];
    if (t >= input[input.length - 1]) return output[output.length - 1];
    for (let i = 0; i < input.length - 1; i++) {
      if (t >= input[i] && t <= input[i + 1]) {
        const span = input[i + 1] - input[i];
        const local = span === 0 ? 0 : (t - input[i]) / span;
        return output[i] + (output[i + 1] - output[i]) * ease(local);
      }
    }
    return output[output.length - 1];
  };
}

// ── timeline context ────────────────────────────────────────────────────────
const TL = React.createContext({ time: 0, duration: 10 });
const useTime = () => React.useContext(TL).time;

// ── Stage (scaling, playback, scrub, persist) ───────────────────────────────
function Stage({ width, height, duration, background, persistKey = 'perryvid', children }) {
  const [time, setTime] = React.useState(() => {
    try { const v = parseFloat(localStorage.getItem(persistKey + ':t') || '0'); return isFinite(v) ? clamp(v, 0, duration) : 0; } catch { return 0; }
  });
  const [playing, setPlaying] = React.useState(true);
  const [hoverTime, setHoverTime] = React.useState(null);
  const [scale, setScale] = React.useState(1);
  const stageRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const lastRef = React.useRef(null);

  React.useEffect(() => { try { localStorage.setItem(persistKey + ':t', String(time)); } catch {} }, [time, persistKey]);

  React.useEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const measure = () => {
      const barH = 46;
      setScale(Math.max(0.05, Math.min(el.clientWidth / width, (el.clientHeight - barH) / height)));
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [width, height]);

  React.useEffect(() => {
    if (!playing) { lastRef.current = null; return; }
    const step = ts => {
      if (lastRef.current == null) lastRef.current = ts;
      const dt = (ts - lastRef.current) / 1000; lastRef.current = ts;
      setTime(t => { let n = t + dt; if (n >= duration) n = n % duration; return n; });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); lastRef.current = null; };
  }, [playing, duration]);

  React.useEffect(() => {
    const onKey = e => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.code === 'Space') { e.preventDefault(); setPlaying(p => !p); }
      else if (e.code === 'ArrowLeft') setTime(t => clamp(t - (e.shiftKey ? 1 : 0.1), 0, duration));
      else if (e.code === 'ArrowRight') setTime(t => clamp(t + (e.shiftKey ? 1 : 0.1), 0, duration));
      else if (e.key === '0' || e.code === 'Home') setTime(0);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [duration]);

  const displayTime = hoverTime != null ? hoverTime : time;
  const ctx = React.useMemo(() => ({ time: displayTime, duration }), [displayTime, duration]);

  return (
    <div ref={stageRef} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: NAVY_D }}>
      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ width, height, background, position: 'relative', transform: `scale(${scale})`, transformOrigin: 'center', flexShrink: 0, boxShadow: '0 20px 60px rgba(0,0,0,0.10)', overflow: 'hidden' }}>
          <TL.Provider value={ctx}>{children}</TL.Provider>
        </div>
      </div>
      <PlaybackBar time={displayTime} duration={duration} playing={playing}
        onPlayPause={() => setPlaying(p => !p)} onReset={() => setTime(0)}
        onSeek={setTime} onHover={setHoverTime} />
    </div>
  );
}

function PlaybackBar({ time, duration, playing, onPlayPause, onReset, onSeek, onHover }) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const fromEvt = React.useCallback(e => {
    const r = trackRef.current.getBoundingClientRect();
    return clamp((e.clientX - r.left) / r.width, 0, 1) * duration;
  }, [duration]);
  React.useEffect(() => {
    if (!dragging) return;
    const up = () => setDragging(false);
    const mv = e => { if (trackRef.current) onSeek(fromEvt(e)); };
    window.addEventListener('mouseup', up); window.addEventListener('mousemove', mv);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('mousemove', mv); };
  }, [dragging, fromEvt, onSeek]);
  const pct = duration > 0 ? (time / duration) * 100 : 0;
  const fmt = t => { const tot = Math.max(0, t); return `${Math.floor(tot / 60)}:${String(Math.floor(tot % 60)).padStart(2, '0')}`; };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', background: 'rgba(255,255,255,0.95)', borderTop: '1px solid rgba(11,30,54,0.08)', width: '100%', maxWidth: 720, alignSelf: 'center', borderRadius: 8, color: INK, fontFamily: MONO, userSelect: 'none', flexShrink: 0, marginBottom: 6 }}>
      <Ico onClick={onReset}><path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" /></Ico>
      <Ico onClick={onPlayPause}>{playing
        ? <g><rect x="3" y="2" width="3" height="10" fill="currentColor" /><rect x="8" y="2" width="3" height="10" fill="currentColor" /></g>
        : <path d="M3 2l9 5-9 5V2z" fill="currentColor" />}</Ico>
      <div style={{ fontSize: 12, width: 42, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(time)}</div>
      <div ref={trackRef} onMouseMove={e => { if (trackRef.current) (dragging ? onSeek : onHover)(fromEvt(e)); }} onMouseLeave={() => { if (!dragging) onHover(null); }} onMouseDown={e => { setDragging(true); onSeek(fromEvt(e)); }} style={{ flex: 1, height: 22, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'rgba(11,30,54,0.12)', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 3, background: GOLD, borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: `${pct}%`, top: '50%', width: 11, height: 11, marginLeft: -5.5, marginTop: -5.5, background: INK, borderRadius: 6 }} />
      </div>
      <div style={{ fontSize: 12, width: 42, color: MUTE, fontVariantNumeric: 'tabular-nums' }}>{fmt(duration)}</div>
    </div>
  );
}
function Ico({ children, onClick }) {
  const [h, setH] = React.useState(false);
  return <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: h ? 'rgba(11,30,54,0.10)' : 'rgba(11,30,54,0.04)', border: '1px solid rgba(11,30,54,0.12)', borderRadius: 6, color: INK, cursor: 'pointer', padding: 0 }}><svg width="14" height="14" viewBox="0 0 14 14">{children}</svg></button>;
}

// ── Scene wrapper: crossfade + local time context ───────────────────────────
const SC = React.createContext({ local: 0, dur: 1 });
const useScene = () => React.useContext(SC);
function Scene({ from, to, fade = 0.7, children }) {
  const t = useTime();
  if (t < from - 0.0001 || t > to + 0.0001) return null;
  const local = t - from, dur = to - from;
  let o = 1;
  if (local < fade) o = Easing.inOutSine(clamp(local / fade, 0, 1));
  else if (t > to - fade) o = Easing.inOutSine(clamp((to - t) / fade, 0, 1));
  return <SC.Provider value={{ local, dur }}><div style={{ position: 'absolute', inset: 0, opacity: o }}>{children}</div></SC.Provider>;
}

// reveal helpers (local-time based)
function Rise({ at = 0, dur = 0.7, y = 34, children, style }) {
  const { local } = useScene();
  const e = Easing.outCubic(clamp((local - at) / dur, 0, 1));
  return <div style={{ ...style, opacity: e, transform: `translateY(${(1 - e) * y}px)`, willChange: 'transform,opacity' }}>{children}</div>;
}
function Mask({ at = 0, dur = 0.85, children, style }) {
  const { local } = useScene();
  const e = Easing.outQuart(clamp((local - at) / dur, 0, 1));
  return <div style={{ overflow: 'hidden', paddingBottom: '0.12em' }}><div style={{ ...style, transform: `translateY(${(1 - e) * 110}%)`, willChange: 'transform' }}>{children}</div></div>;
}
function Kicker({ children, color = GOLD, at = 0, style }) {
  return <Rise at={at} y={16}><div style={{ fontFamily: MONO, fontSize: 21, letterSpacing: '0.32em', textTransform: 'uppercase', color, ...style }}>{children}</div></Rise>;
}

// ── persistent atmosphere ───────────────────────────────────────────────────
function Atmosphere() {
  const t = useTime();
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 90% at 50% 22%, ${PANEL} 0%, ${NAVY} 46%, ${NAVY_D} 100%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(130% 100% at 50% 55%, transparent 52%, rgba(0,0,0,0.05) 100%)' }} />
      <div style={{ position: 'absolute', width: 1400, height: 1400, left: 260 + Math.sin(t * 0.18) * 90, top: -560 + Math.cos(t * 0.14) * 70, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,167,94,0.08) 0%, transparent 60%)' }} />
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 1 — opening tension
function SceneOpen() {
  return <Scene from={0} to={6.2}><OpenBody /></Scene>;
}
function OpenBody() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 200, paddingRight: 200 }}>
      <div style={{ marginBottom: 40 }}><Kicker at={0.15} color={MUTE}>For the GP &middot; the general counsel &middot; the CFO &middot; the LP</Kicker></div>
      <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 104, lineHeight: 1.06, color: INK, letterSpacing: '-0.015em' }}>
        <Mask at={0.45}><span>Where does your fund's</span></Mask>
        <Mask at={0.62}><span>legal actually <span style={{ fontStyle: 'italic', color: GOLD }}>live</span>?</span></Mask>
      </div>
      <Rise at={2.6} y={24} style={{ marginTop: 56 }}>
        <div style={{ fontFamily: SERIF, fontSize: 38, color: MUTE, letterSpacing: '-0.01em' }}>
          Right now, the honest answer is&nbsp;<span style={{ color: RUST, fontStyle: 'italic' }}>— somewhere else.</span>
        </div>
      </Rise>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2 — data exposure
function DocChip({ label, meta, at, leak }) {
  const { local } = useScene();
  const x = interpolate([at, at + 2.0], [0, 1], Easing.outCubic)(local);
  const startX = 300, endX = 1310;
  const left = startX + (endX - startX) * x;
  const appear = clamp((local - (at - 0.4)) / 0.5, 0, 1);
  const exposed = x > 0.82;
  return (
    <div style={{ position: 'absolute', left, top: leak, width: 248, opacity: appear, transform: `translateY(${(1 - appear) * 10}px)` }}>
      <div style={{ background: PANEL, border: `1px solid ${exposed ? 'hsla(172, 64%, 31%, 0.7)' : FAINT}`, borderRadius: 10, padding: '15px 17px', boxShadow: '0 14px 30px rgba(11,30,54,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
          <div style={{ width: 9, height: 9, borderRadius: 2, background: exposed ? RUST : GOLD }} />
          <div style={{ fontFamily: MONO, fontSize: 17, color: INK }}>{label}</div>
        </div>
        <div style={{ height: 5, background: FAINT, borderRadius: 3, marginBottom: 7 }} />
        <div style={{ height: 5, width: '64%', background: FAINT, borderRadius: 3, marginBottom: 12 }} />
        <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.12em', color: exposed ? RUST : MUTE, textTransform: 'uppercase' }}>{exposed ? 'exposed' : meta}</div>
      </div>
    </div>
  );
}
function Boundary({ x, w, label, sub, broken, color }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 250, width: w, height: 520 }}>
      <div style={{ position: 'absolute', inset: 0, border: `1.5px ${broken ? 'dashed' : 'solid'} ${color}`, borderRadius: 18, opacity: broken ? 0.6 : 0.9 }} />
      <div style={{ position: 'absolute', top: -16, left: 26, background: NAVY, padding: '0 14px', fontFamily: MONO, fontSize: 15, letterSpacing: '0.22em', textTransform: 'uppercase', color }}>{label}</div>
      <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, textAlign: 'center', fontFamily: SERIF, fontSize: 22, fontStyle: 'italic', color: MUTE }}>{sub}</div>
    </div>
  );
}
function SceneSecurity() {
  return <Scene from={6.2} to={15.4}><SecurityBody /></Scene>;
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2.5 — fragmented counsel / contradictory positions
function FirmCard({ firm, verdict, tone, at }) {
  const { local } = useScene();
  const e = Easing.outCubic(clamp((local - at) / 0.7, 0, 1));
  const color = tone === 'yes' ? GOLD : tone === 'no' ? RUST : MUTE;
  const label = tone === 'yes' ? 'Permissible' : tone === 'no' ? 'Prohibited' : 'Conditional';
  return (
    <div style={{ flex: 1, opacity: e, transform: `translateY(${(1 - e) * 28}px)` }}>
      <div style={{ background: PANEL, border: `1px solid ${FAINT}`, borderRadius: 12, padding: '32px 32px 36px', height: 320, boxShadow: '0 18px 40px rgba(11,30,54,0.08)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTE, marginBottom: 24 }}>{firm}</div>
        <div style={{ fontFamily: SERIF, fontSize: 35, color, fontStyle: 'italic', lineHeight: 1.25, flex: 1 }}>“{verdict}”</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: MONO, fontSize: 14, letterSpacing: '0.14em', textTransform: 'uppercase', color }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: color }} />{label}
        </div>
      </div>
    </div>
  );
}
function SceneFragmented() {
  return <Scene from={15.4} to={23.6}><FragmentedBody /></Scene>;
}
function FragmentedBody() {
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <Kicker at={0.1} color={RUST}>Risk 02 — Fragmented counsel</Kicker>
      </div>
      <div style={{ position: 'absolute', top: 196, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={0.5} y={18}>
          <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTE, marginBottom: 18 }}>One question · three firms on retainer</div>
        </Rise>
        <Rise at={0.7} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 48, color: INK, letterSpacing: '-0.01em' }}>“Can we waive the MFN in this side letter?”</div>
        </Rise>
      </div>
      <div style={{ position: 'absolute', left: 200, right: 200, top: 432, display: 'flex', gap: 44 }}>
        <FirmCard firm="Wilson & Hale" verdict="Yes — permissible under §4.2." tone="yes" at={1.4} />
        <FirmCard firm="Drake Coyle LLP" verdict="No — it triggers the MFN cascade." tone="no" at={1.7} />
        <FirmCard firm="Bremer & Stone" verdict="Only with full LP consent." tone="maybe" at={2.0} />
      </div>
      <div style={{ position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={3.2} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 46, color: INK, letterSpacing: '-0.01em' }}>
            Three firms. Three answers. <span style={{ color: RUST, fontStyle: 'italic' }}>No single source of truth.</span>
          </div>
        </Rise>
      </div>
    </React.Fragment>
  );
}
function SecurityBody() {
  const { local } = useScene();
  const leaving = local > 1.2;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <Kicker at={0.1} color={RUST}>Risk 01 — Data security</Kicker>
      </div>
      <Boundary x={150} w={470} label="Your fund" sub={leaving ? 'left unguarded' : 'where it should stay'} broken={leaving} color={leaving ? RUST : GOLD} />
      <Boundary x={1300} w={470} label="Outside counsel" sub="inboxes · servers · laptops" broken={false} color={MUTE} />
      <div style={{ position: 'absolute', left: 620, right: 150, top: 506, height: 1, borderTop: `1px dashed ${FAINT}` }} />
      <DocChip label="lpa.pdf" meta="confidential" at={1.0} leak={330} />
      <DocChip label="side-letters.docx" meta="confidential" at={1.5} leak={452} />
      <DocChip label="cap-table.xlsx" meta="restricted" at={2.0} leak={574} />
      <div style={{ position: 'absolute', bottom: 96, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={2.4} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 46, color: INK, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Your most sensitive documents sit in <span style={{ color: RUST, fontStyle: 'italic' }}>other people's inboxes.</span>
          </div>
        </Rise>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 3 — spiraling cost
function CostLine({ label, amount, at }) {
  const { local } = useScene();
  const a = clamp((local - at) / 0.4, 0, 1);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, opacity: a, transform: `translateY(${(1 - a) * 12}px)`, padding: '13px 0', borderBottom: `1px solid ${FAINT}` }}>
      <span style={{ fontFamily: MONO, fontSize: 19, color: MUTE, letterSpacing: '0.01em' }}>{label}</span>
      <span style={{ fontFamily: MONO, fontSize: 19, color: GOLD, fontVariantNumeric: 'tabular-nums' }}>{amount}</span>
    </div>
  );
}
function SceneCost() {
  return <Scene from={23.6} to={32.6}><CostBody /></Scene>;
}
function CostBody() {
  const { local } = useScene();
  const prog = Easing.outCubic(clamp((local - 1.0) / 4.2, 0, 1));
  const value = Math.round(prog * 260000);
  const display = '$' + value.toLocaleString('en-US');
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <Kicker at={0.1} color={RUST}>Risk 03 — Spiraling legal spend</Kicker>
      </div>
      <div style={{ position: 'absolute', left: 190, top: 280, width: 620 }}>
        <CostLine label="Reviewed a 2-page NDA" amount="+ $1,400" at={1.2} />
        <CostLine label="Call re: side-letter clause" amount="+ $2,250" at={1.9} />
        <CostLine label='"Quick question" by email' amount="+ $980" at={2.6} />
        <CostLine label="Marked up the same LPA again" amount="+ $6,300" at={3.3} />
        <CostLine label="Diligence on one SPV" amount="+ $18,500" at={4.0} />
      </div>
      <div style={{ position: 'absolute', right: 190, top: 300, width: 720, textAlign: 'right' }}>
        <Rise at={0.6} y={18}><div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTE, marginBottom: 18 }}>Outside counsel · last year</div></Rise>
        <div style={{ fontFamily: MONO, fontSize: 132, fontWeight: 500, color: GOLD, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{display}</div>
        <div style={{ height: 4, background: FAINT, borderRadius: 2, marginTop: 30, marginLeft: 'auto', width: '100%', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${prog * 100}%`, background: RUST, borderRadius: 2 }} />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 96, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={4.4} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 46, color: INK, letterSpacing: '-0.01em' }}>
            Every question comes with <span style={{ color: RUST, fontStyle: 'italic' }}>an invoice.</span>
          </div>
        </Rise>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 4 — knowledge walks out
const NODES = [
  { id: 0, x: 500, y: 250, label: 'The partner\nwho knows it all', lead: true, r: 13 },
  { id: 1, x: 250, y: 140, label: 'Fund I precedents', r: 8 },
  { id: 2, x: 250, y: 380, label: 'Why we structured the SPV', r: 8 },
  { id: 3, x: 760, y: 150, label: 'LPA negotiation history', r: 8 },
  { id: 4, x: 800, y: 360, label: 'Side-letter rationale', r: 8 },
  { id: 5, x: 540, y: 60, label: 'Regulatory positions', r: 7 },
  { id: 6, x: 560, y: 450, label: 'Deal terms & carve-outs', r: 7 },
];
const EDGES = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 2], [3, 5], [4, 6]];
function SceneKnowledge() {
  return <Scene from={32.6} to={40.4}><KnowledgeBody /></Scene>;
}
function KnowledgeBody() {
  const { local } = useScene();
  const leave = Easing.inCubic(clamp((local - 4.6) / 2.0, 0, 1));
  const leadNode = NODES[0];
  const lx = leadNode.x + leave * 520;
  const ly = leadNode.y - leave * 240;
  const dim = 1 - leave * 0.78;
  const pos = id => id === 0 ? { x: lx, y: ly } : { x: NODES[id].x, y: NODES[id].y };
  const VW = 1040, VH = 520, OX = (1920 - VW) / 2, OY = 250;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <Kicker at={0.1} color={RUST}>Risk 04 — Institutional knowledge</Kicker>
      </div>
      <div style={{ position: 'absolute', left: OX, top: OY, width: VW, height: VH }}>
        <svg width={VW} height={VH} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {EDGES.map(([a, b], i) => {
            const pa = pos(a), pb = pos(b);
            const conn = a === 0 || b === 0;
            const appear = clamp((local - 0.6 - i * 0.08) / 0.5, 0, 1);
            return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={GOLD} strokeWidth="1.2" strokeOpacity={appear * 0.5 * (conn ? dim : 1)} />;
          })}
        </svg>
        {NODES.map(n => {
          const p = pos(n.id);
          const appear = clamp((local - 0.4 - n.id * 0.07) / 0.5, 0, 1);
          const isLead = n.lead;
          const op = appear * (isLead ? (1 - leave * 0.65) : (n.id === 0 ? 1 : dim));
          return (
            <div key={n.id} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%,-50%)', opacity: op, textAlign: 'center' }}>
              <div style={{ width: n.r * 2, height: n.r * 2, borderRadius: '50%', background: isLead ? RUST : GOLD, margin: '0 auto', boxShadow: isLead ? `0 0 22px ${RUST}` : `0 0 14px rgba(11,30,54,0.12)` }} />
              <div style={{ fontFamily: MONO, fontSize: 14, color: isLead ? INK : MUTE, marginTop: 12, whiteSpace: 'pre-line', lineHeight: 1.3, letterSpacing: '0.02em', maxWidth: 180 }}>{n.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={4.6} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 46, color: INK, letterSpacing: '-0.01em' }}>
            When they move on, <span style={{ color: RUST, fontStyle: 'italic' }}>your history goes with them.</span>
          </div>
        </Rise>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 5 — the turn
function SceneTurn() {
  return <Scene from={40.4} to={44.8} fade={0.8}><TurnBody /></Scene>;
}
function TurnBody() {
  const { local } = useScene();
  const drift = interpolate([0, 4], [0, 1], Easing.outCubic)(local);
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(246,244,239,0.75)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', transform: `scale(${1 + drift * 0.04})` }}>
          <div style={{ fontFamily: SERIF, fontSize: 92, fontWeight: 500, color: INK, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            <Mask at={0.3}><span>What if your fund</span></Mask>
            <Mask at={0.5}><span><span style={{ fontStyle: 'italic', color: GOLD }}>owned</span> all of it?</span></Mask>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 6 — Perry: three pillars
function Pillar({ idx, title, body, at }) {
  const { local } = useScene();
  const e = Easing.outCubic(clamp((local - at) / 0.8, 0, 1));
  return (
    <div style={{ flex: 1, opacity: e, transform: `translateY(${(1 - e) * 30}px)` }}>
      <div style={{ height: 2, background: GOLD, width: 54, marginBottom: 26 }} />
      <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: '0.22em', color: GOLD, marginBottom: 20 }}>{idx}</div>
      <div style={{ fontFamily: SERIF, fontSize: 46, fontWeight: 500, color: INK, marginBottom: 18, letterSpacing: '-0.01em' }}>{title}</div>
      <div style={{ fontFamily: SERIF, fontSize: 27, color: MUTE, lineHeight: 1.45 }}>{body}</div>
    </div>
  );
}
function ScenePerry() {
  return <Scene from={44.8} to={55.4} fade={0.8}><PerryBody /></Scene>;
}
function PerryBody() {
  const { local } = useScene();
  const e = Easing.outExpo(clamp(local / 1.0, 0, 1));
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 130, left: 200, right: 200 }}>
        <Kicker at={0.1} color={GOLD}>Introducing</Kicker>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 34, marginTop: 22, opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>
          <div style={{ fontFamily: SERIF, fontSize: 128, fontWeight: 600, color: INK, letterSpacing: '-0.03em', lineHeight: 0.9 }}>Perry</div>
          <div style={{ fontFamily: SERIF, fontSize: 34, fontStyle: 'italic', color: MUTE, paddingBottom: 22 }}>the legal operating system for funds.</div>
        </div>
        <div style={{ height: 1, background: FAINT, marginTop: 50 }} />
      </div>
      <div style={{ position: 'absolute', left: 200, right: 200, top: 470, display: 'flex', gap: 80 }}>
        <Pillar idx="01 · Secure" title="Your data never leaves." body="Sensitive documents stay inside your walls — not in an outside firm's inbox." at={1.2} />
        <Pillar idx="02 · In control" title="Your legal, your terms." body="Run counsel, contracts, and decisions on a system you own and direct." at={1.5} />
        <Pillar idx="03 · Retained" title="Knowledge that stays." body="Every precedent and rationale is captured in-house — and never walks out the door." at={1.8} />
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 7 — close
function SceneClose() {
  return <Scene from={55.4} to={60.2} fade={0.8}><CloseBody /></Scene>;
}
function CloseBody() {
  const { local } = useScene();
  const drift = interpolate([0, 5], [1, 1.05], Easing.outCubic)(local);
  const line = Easing.outQuart(clamp((local - 0.9) / 0.9, 0, 1));
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${drift})` }}>
      <Rise at={0.1} y={22}><div style={{ fontFamily: SERIF, fontSize: 150, fontWeight: 600, color: INK, letterSpacing: '-0.03em' }}>Perry</div></Rise>
      <div style={{ height: 1.5, background: GOLD, width: line * 360, marginTop: 30, marginBottom: 34 }} />
      <Rise at={1.0} y={18}><div style={{ fontFamily: SERIF, fontSize: 44, fontStyle: 'italic', color: GOLD, letterSpacing: '-0.01em' }}>Take your legal in-house.</div></Rise>
      <Rise at={1.6} y={14}><div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: '0.3em', color: MUTE, marginTop: 40, textTransform: 'uppercase' }}>useperry.com</div></Rise>
    </div>
  );
}

// ── root ────────────────────────────────────────────────────────────────────
function PerryVideo() {
  return (
    <Stage width={1920} height={1080} duration={60.2} background={NAVY}>
      <Atmosphere />
      <SceneOpen />
      <SceneSecurity />
      <SceneFragmented />
      <SceneCost />
      <SceneKnowledge />
      <SceneTurn />
      <ScenePerry />
      <SceneClose />
    </Stage>
  );
}

try { module.exports = { PerryVideo }; } catch (e) {}
window.PerryVideo = PerryVideo;
