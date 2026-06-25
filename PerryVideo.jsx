// PerryVideo.jsx — Perry explainer video
// Brand: light warm palette, lowercase "perry" wordmark,
// Spectral serif headlines, Hanken Grotesk body.

const BG     = '#F6F4EF';
const BG_D   = '#EDE9E2';
const PANEL  = '#FFFFFF';
const INK    = '#0C1116';
const MUTE   = 'rgba(12,17,22,0.55)';
const FAINT  = 'rgba(12,17,22,0.10)';
const LINE   = 'rgba(12,17,22,0.14)';
const CLAY   = 'hsla(172, 64%, 31%, 1)';
const SERIF  = "'Spectral', Georgia, 'Times New Roman', serif";
const SANS   = "'Hanken Grotesk', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const Easing = {
  linear:    t => t,
  outCubic:  t => (--t) * t * t + 1,
  inCubic:   t => t * t * t,
  outQuart:  t => 1 - (--t) * t * t * t,
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  outBack:   t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outExpo:   t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
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

const TL = React.createContext({ time: 0, duration: 10 });
const useTime = () => React.useContext(TL).time;

function PerryLogo({ size = 168, color = INK }) {
  const height = size;
  const width = size * (1800 / 488);
  return (
    <svg width={width} height={height} viewBox="0 0 1800 488" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="perry" style={{ display: 'block' }}>
      <path d="M12.6509 485.073C8.445 485.073 3.7754 484.974 0 484.775L0.132499 173.305C12.4853 174.729 46.8945 181.452 80.3432 213.013C93.9545 225.895 110.646 250.998 116.806 267.789C130.748 306.073 132.669 346.476 122.336 384.595C118.13 400.094 112.633 414.103 105.976 426.19C94.1532 447.651 77.7932 464.143 58.6513 473.813C45.0068 480.735 29.3091 484.61 13.2802 485.073H12.6841H12.6509Z" fill={color} />
      <path d="M0.827939 0H128.894C128.894 0 125.052 47.5568 115.216 69.8449C108.891 84.2842 100.611 97.8623 90.6428 110.182C82.5621 120.184 73.8853 128.629 64.8442 135.318C43.8146 150.817 20.4004 156.282 0 159.428L0.79489 0H0.827939Z" fill={color} />
      <path d="M154.93 333.461C157.116 292.594 173.376 251.594 198.579 223.444C219.476 200.096 243.188 183.736 278.988 175.556C289.818 173.072 312.702 172.907 313.43 172.874L313.53 160.322C246.003 158.997 198.413 126.973 172.416 74.7794C156.851 43.4502 154.003 11.6242 153.473 0.331095C158.275 0.132389 163.01 0 167.581 0C182.086 0 195.896 1.02659 208.613 3.04676C252.163 9.93521 288.261 32.0909 315.848 68.9176C336.811 96.8688 348.27 131.576 348.138 166.681C347.873 235.598 296.242 281.433 294.024 283.321L293.692 283.652C251.103 329.718 176.986 333.428 154.93 333.428V333.461Z" fill={color} />
      <path d="M531.968 351.576C433.178 339.554 388.735 252.058 389.264 175.722C389.794 97.2663 436.159 13.3133 538.558 2.58317C555.051 0.861053 570.815 0 585.42 0C698.947 0 765.712 48.1199 783.827 142.969C786.112 154.99 783.926 213.111 783.926 213.111H515.707V140.617H697.357L697.158 138.763C694.608 116.011 674.605 99.154 655.927 92.5305C644.137 88.3577 620.127 85.8408 591.712 85.8408C567.006 85.8408 535.247 87.9602 520.145 93.8551C497.559 102.731 472.787 128.629 471.032 174.728C469.972 202.249 478.616 232.386 500.672 250.302C512.925 260.238 528.656 265.901 544.321 266.828C553.892 267.391 563.728 266.696 573.332 266.696C594.759 266.696 616.153 266.696 637.58 266.696H705.57C720.771 266.696 735.972 266.696 751.173 266.696C751.471 266.696 757.432 266.696 757.432 266.696V351.51H531.935L531.968 351.576Z" fill={color} />
      <path d="M823.574 349.385V163.927C823.574 132.697 849.571 78.8477 871.065 55.1355C879.907 45.3989 898.619 31.6552 918.754 20.1634C941.208 7.34687 960.681 0.027832 972.14 0.027832H1086.86V84.8419H911.468V349.418H823.574V349.385Z" fill={color} />
      <path d="M1103.85 349.39V160.852C1103.85 128.562 1122.86 87.894 1153.46 54.7102C1185.06 20.4666 1223.21 0 1255.5 0H1364.09V84.814H1191.78V349.39H1103.85Z" fill={color} />
      <path d="M1592.25 487.292C1574.57 487.292 1556.39 486.298 1538.83 485.338C1521.02 484.377 1502.73 483.384 1484.82 483.384C1466.9 483.384 1452.86 484.278 1439.25 486.133L1438.12 486.265L1437.92 409.929C1437.92 407.876 1437.92 405.293 1439.38 403.306C1441.4 400.557 1445.08 400.193 1448.42 400.193L1607.29 401.319H1611.92C1643.22 401.319 1674.81 398.371 1693.66 376.911C1711.18 357.04 1710.32 335.58 1709.26 308.424C1709.26 307.861 1709.22 307.298 1709.19 306.735L1708.92 301.37L1706.18 305.211C1691.54 325.512 1671.34 336.143 1653.52 343.827C1638.62 350.284 1620.9 353.431 1599.37 353.431C1597.12 353.431 1594.8 353.431 1592.55 353.331C1528.93 351.543 1472.2 325.645 1440.77 284.016C1415.9 251.064 1403.48 206.024 1402.82 146.313C1402.62 128.96 1403.61 15.764 1403.75 0.72859H1492.04L1492.44 169.131C1492.5 196.785 1494.09 225.299 1512.31 243.48C1534.43 265.57 1571.75 266 1599.01 266.298H1600.93C1612.22 266.298 1658.92 265.835 1686.8 265.57L1708.92 265.371V0.72859L1760.12 0C1776.65 0.430528 1794.96 1.68901 1797.85 3.01371C1802.05 15.764 1799.07 190.426 1797.55 257.257V257.621C1797.68 291.501 1797.81 326.539 1787.88 359.756C1772.44 411.221 1731.64 454.87 1681.37 473.68C1662.46 480.768 1641.46 484.974 1617.19 486.563C1609.14 487.06 1601.03 487.325 1592.32 487.325L1592.25 487.292Z" fill={color} />
    </svg>
  );
}
function DemoButton({ scale = 1 }) {
  return (
    <a href="https://calendly.com/vaneesa-useperry/30min" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: CLAY, color: '#FFFFFF', fontFamily: SANS, fontWeight: 600, fontSize: 27 * scale, padding: `${20 * scale}px ${34 * scale}px`, borderRadius: 14, textDecoration: 'none' }}>
      Book a demo <span style={{ fontSize: 26 * scale }}>&rarr;</span>
    </a>
  );
}

// ── Stage ───────────────────────────────────────────────────────────────────
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
      setTime(t => {
        let n = t + dt;
        if (n >= duration) {
          n = duration;
          setPlaying(false);
        }
        return n;
      });
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
    <div ref={stageRef} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: BG_D }}>
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
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', background: 'rgba(255,255,255,0.95)', borderTop: '1px solid rgba(12,17,22,0.08)', width: '100%', maxWidth: 720, alignSelf: 'center', borderRadius: 8, color: INK, fontFamily: SANS, userSelect: 'none', flexShrink: 0, marginBottom: 6 }}>
      <Ico onClick={onReset}><path d="M3 2v10M12 2L5 7l7 5V2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" /></Ico>
      <Ico onClick={onPlayPause}>{playing
        ? <g><rect x="3" y="2" width="3" height="10" fill="currentColor" /><rect x="8" y="2" width="3" height="10" fill="currentColor" /></g>
        : <path d="M3 2l9 5-9 5V2z" fill="currentColor" />}</Ico>
      <div style={{ fontSize: 12, width: 42, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(time)}</div>
      <div ref={trackRef} onMouseMove={e => { if (trackRef.current) (dragging ? onSeek : onHover)(fromEvt(e)); }} onMouseLeave={() => { if (!dragging) onHover(null); }} onMouseDown={e => { setDragging(true); onSeek(fromEvt(e)); }} style={{ flex: 1, height: 22, position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, height: 3, background: 'rgba(12,17,22,0.12)', borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: 3, background: INK, borderRadius: 2 }} />
        <div style={{ position: 'absolute', left: `${pct}%`, top: '50%', width: 11, height: 11, marginLeft: -5.5, marginTop: -5.5, background: INK, borderRadius: 6 }} />
      </div>
      <div style={{ fontSize: 12, width: 42, color: MUTE, fontVariantNumeric: 'tabular-nums' }}>{fmt(duration)}</div>
    </div>
  );
}
function Ico({ children, onClick }) {
  const [h, setH] = React.useState(false);
  return <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', background: h ? 'rgba(12,17,22,0.10)' : 'rgba(12,17,22,0.04)', border: '1px solid rgba(12,17,22,0.12)', borderRadius: 6, color: INK, cursor: 'pointer', padding: 0 }}><svg width="14" height="14" viewBox="0 0 14 14">{children}</svg></button>;
}

// ── Scene + reveal helpers ───────────────────────────────────────────────────
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
function Kicker({ children, color = INK, at = 0, style }) {
  return <Rise at={at} y={16}><div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 20, letterSpacing: '0.26em', textTransform: 'uppercase', color, ...style }}>{children}</div></Rise>;
}

// ── Atmosphere ───────────────────────────────────────────────────────────────
function Atmosphere() {
  const t = useTime();
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(125% 95% at 50% 18%, ${PANEL} 0%, ${BG} 46%, ${BG_D} 100%)` }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(130% 100% at 50% 55%, transparent 48%, rgba(0,0,0,0.05) 100%)' }} />
      <div style={{ position: 'absolute', width: 1500, height: 1500, left: 220 + Math.sin(t * 0.16) * 90, top: -600 + Math.cos(t * 0.13) * 70, borderRadius: '50%', background: 'radial-gradient(circle, rgba(12,17,22,0.04) 0%, transparent 60%)' }} />
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 1 - opening tension (leads with deal execution)
function SceneOpen() {
  return <Scene from={0} to={6.2}><OpenBody /></Scene>;
}
function OpenBody() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 200, paddingRight: 200 }}>
      <div style={{ marginBottom: 40 }}><Kicker at={0.15} color={MUTE}>For the GP &middot; the general counsel &middot; the CFO</Kicker></div>
      <div style={{ fontFamily: SERIF, fontWeight: 500, fontSize: 104, lineHeight: 1.06, color: INK, letterSpacing: '-0.015em' }}>
        <Mask at={0.45}><span>Your deal legal lives across</span></Mask>
        <Mask at={0.62}><span>firms, drives, and <span style={{ fontStyle: 'italic' }}>inboxes.</span></span></Mask>
      </div>
      <Rise at={2.6} y={24} style={{ marginTop: 56 }}>
        <div style={{ fontFamily: SERIF, fontSize: 38, color: MUTE, letterSpacing: '-0.01em' }}>
          None of it is&nbsp;<span style={{ color: CLAY, fontStyle: 'italic' }}>yours.</span>
        </div>
      </Rise>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2 - data exposure
function DocChip({ label, meta, at, leak }) {
  const { local } = useScene();
  const x = interpolate([at, at + 2.0], [0, 1], Easing.outCubic)(local);
  const startX = 300, endX = 1310;
  const left = startX + (endX - startX) * x;
  const appear = clamp((local - (at - 0.4)) / 0.5, 0, 1);
  const exposed = x > 0.82;
  return (
    <div style={{ position: 'absolute', left, top: leak, width: 248, opacity: appear, transform: `translateY(${(1 - appear) * 10}px)` }}>
      <div style={{ background: PANEL, border: `1px solid ${exposed ? 'hsla(172, 64%, 31%, 0.7)' : FAINT}`, borderRadius: 10, padding: '15px 17px', boxShadow: '0 14px 30px rgba(12,17,22,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 11 }}>
          <div style={{ width: 9, height: 9, borderRadius: 2, background: exposed ? CLAY : INK }} />
          <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 17, color: INK }}>{label}</div>
        </div>
        <div style={{ height: 5, background: FAINT, borderRadius: 3, marginBottom: 7 }} />
        <div style={{ height: 5, width: '64%', background: FAINT, borderRadius: 3, marginBottom: 12 }} />
        <div style={{ fontFamily: SANS, fontSize: 12, letterSpacing: '0.12em', color: exposed ? CLAY : MUTE, textTransform: 'uppercase' }}>{exposed ? 'exposed' : meta}</div>
      </div>
    </div>
  );
}
function Boundary({ x, w, label, sub, broken, color }) {
  return (
    <div style={{ position: 'absolute', left: x, top: 250, width: w, height: 520 }}>
      <div style={{ position: 'absolute', inset: 0, border: `1.5px ${broken ? 'dashed' : 'solid'} ${color}`, borderRadius: 18, opacity: broken ? 0.6 : 0.9 }} />
      <div style={{ position: 'absolute', top: -16, left: 26, background: BG, padding: '0 14px', fontFamily: SANS, fontWeight: 600, fontSize: 15, letterSpacing: '0.2em', textTransform: 'uppercase', color }}>{label}</div>
      <div style={{ position: 'absolute', bottom: 22, left: 0, right: 0, textAlign: 'center', fontFamily: SERIF, fontSize: 22, fontStyle: 'italic', color: MUTE }}>{sub}</div>
    </div>
  );
}
function SceneSecurity() {
  return <Scene from={23.0} to={32.2}><SecurityBody /></Scene>;
}
function SecurityBody() {
  const { local } = useScene();
  const leaving = local > 1.2;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <Kicker at={0.1} color={CLAY}>Risk 03 - Data security</Kicker>
      </div>
      <Boundary x={150} w={470} label="Your fund" sub={leaving ? 'left unguarded' : 'where it should stay'} broken={leaving} color={leaving ? CLAY : INK} />
      <Boundary x={1300} w={470} label="Outside counsel" sub="inboxes &middot; servers &middot; laptops" broken={false} color={MUTE} />
      <div style={{ position: 'absolute', left: 620, right: 150, top: 506, height: 1, borderTop: `1px dashed ${FAINT}` }} />
      <DocChip label="deal-documents.pdf" meta="confidential" at={1.0} leak={330} />
      <DocChip label="term-sheet-v4.docx" meta="confidential" at={1.5} leak={452} />
      <DocChip label="cap-table.xlsx" meta="restricted" at={2.0} leak={574} />
      <div style={{ position: 'absolute', bottom: 96, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={2.4} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 46, color: INK, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Your most sensitive documents sit in <span style={{ color: CLAY, fontStyle: 'italic' }}>other people's inboxes.</span>
          </div>
        </Rise>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 2.5 - fragmented counsel / contradictory positions on a deal issue
function FirmCard({ firm, verdict, tone, at }) {
  const { local } = useScene();
  const e = Easing.outCubic(clamp((local - at) / 0.7, 0, 1));
  const color = tone === 'yes' ? INK : tone === 'no' ? CLAY : MUTE;
  const label = tone === 'yes' ? 'Permissible' : tone === 'no' ? 'Prohibited' : 'Conditional';
  return (
    <div style={{ flex: 1, opacity: e, transform: `translateY(${(1 - e) * 28}px)` }}>
      <div style={{ background: PANEL, border: `1px solid ${FAINT}`, borderRadius: 12, padding: '32px 32px 36px', height: 320, boxShadow: '0 18px 40px rgba(12,17,22,0.08)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 15, letterSpacing: '0.16em', textTransform: 'uppercase', color: MUTE, marginBottom: 24 }}>{firm}</div>
        <div style={{ fontFamily: SERIF, fontSize: 33, color, fontStyle: 'italic', lineHeight: 1.25, flex: 1 }}>"{verdict}"</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontFamily: SANS, fontWeight: 600, fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: color }} />{label}
        </div>
      </div>
    </div>
  );
}
function SceneFragmented() {
  return <Scene from={32.2} to={40.4}><FragmentedBody /></Scene>;
}
function FragmentedBody() {
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <Kicker at={0.1} color={CLAY}>Risk 04 - Fragmented counsel</Kicker>
      </div>
      <div style={{ position: 'absolute', top: 196, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={0.5} y={18}>
          <div style={{ fontFamily: SANS, fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTE, marginBottom: 18 }}>One question &middot; three firms on retainer</div>
        </Rise>
        <Rise at={0.7} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 44, color: INK, letterSpacing: '-0.01em' }}>"Are drag-along rights standard at Series C, or can we push back?"</div>
        </Rise>
      </div>
      <div style={{ position: 'absolute', left: 200, right: 200, top: 432, display: 'flex', gap: 44 }}>
        <FirmCard firm="Wilson & Hale" verdict="Yes - drag-alongs are market standard at this stage." tone="yes" at={1.4} />
        <FirmCard firm="Drake Coyle LLP" verdict="No - we're seeing founders push back successfully at Series C." tone="no" at={1.7} />
        <FirmCard firm="Bremer & Stone" verdict="Depends - threshold and carve-outs vary by investor." tone="maybe" at={2.0} />
      </div>
      <div style={{ position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={3.2} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 46, color: INK, letterSpacing: '-0.01em' }}>
            Three firms. Three answers. <span style={{ color: CLAY, fontStyle: 'italic' }}>No single source of truth.</span>
          </div>
        </Rise>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 3 - spiraling cost
function CostLine({ label, amount, at }) {
  const { local } = useScene();
  const a = clamp((local - at) / 0.4, 0, 1);
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 24, opacity: a, transform: `translateY(${(1 - a) * 12}px)`, padding: '13px 0', borderBottom: `1px solid ${FAINT}` }}>
      <span style={{ fontFamily: SANS, fontSize: 19, color: MUTE, letterSpacing: '0.01em' }}>{label}</span>
      <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 19, color: CLAY, fontVariantNumeric: 'tabular-nums' }}>{amount}</span>
    </div>
  );
}
function SceneCost() {
  return <Scene from={6.2} to={15.2}><CostBody /></Scene>;
}
function CostBody() {
  const { local } = useScene();
  const elapsed = Math.max(0, local - 1.0);
  const prog = Easing.outCubic(elapsed / 4.2);
  const value = Math.round(prog * 260000);
  const display = '\u00a3' + value.toLocaleString('en-GB');
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <Kicker at={0.1} color={CLAY}>Risk 01 - Spiraling legal spend</Kicker>
      </div>
      <div style={{ position: 'absolute', left: 190, top: 280, width: 640 }}>
        <CostLine label="Reviewed a 2-page NDA" amount="+ &pound;1,400" at={1.2} />
        <CostLine label="Call re: deal term clause" amount="+ &pound;2,250" at={1.9} />
        <CostLine label='"Quick question" by email' amount="+ &pound;980" at={2.6} />
        <CostLine label="Marked up the same SHA again" amount="+ &pound;6,300" at={3.3} />
        <CostLine label="Diligence on one transaction" amount="+ &pound;18,500" at={4.0} />
      </div>
      <div style={{ position: 'absolute', right: 190, top: 300, width: 720, textAlign: 'right' }}>
        <Rise at={0.6} y={18}><div style={{ fontFamily: SANS, fontSize: 16, letterSpacing: '0.2em', textTransform: 'uppercase', color: MUTE, marginBottom: 18 }}>Outside counsel &middot; last year</div></Rise>
        <div style={{ fontFamily: SANS, fontSize: 132, fontWeight: 600, color: CLAY, letterSpacing: '-0.03em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{display}</div>
        <div style={{ height: 4, background: FAINT, borderRadius: 2, marginTop: 30, marginLeft: 'auto', width: '100%', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${clamp(prog, 0, 1) * 100}%`, background: CLAY, borderRadius: 2 }} />
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 96, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={4.4} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 46, color: INK, letterSpacing: '-0.01em' }}>
            Every question comes with <span style={{ color: CLAY, fontStyle: 'italic' }}>an invoice.</span>
          </div>
        </Rise>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 4 - knowledge walks out
const NODES = [
  { id: 0, x: 500, y: 250, label: 'The partner\nwho knows it all', lead: true, r: 13 },
  { id: 1, x: 250, y: 140, label: 'Deal precedents', r: 8 },
  { id: 2, x: 250, y: 380, label: 'Why we structured the SPV', r: 8 },
  { id: 3, x: 760, y: 150, label: 'Negotiation history', r: 8 },
  { id: 4, x: 800, y: 360, label: 'Term rationale', r: 8 },
  { id: 5, x: 540, y: 60, label: 'Regulatory positions', r: 7 },
  { id: 6, x: 560, y: 450, label: 'Deal terms & carve-outs', r: 7 },
];
const EDGES = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 2], [3, 5], [4, 6]];
function SceneKnowledge() {
  return <Scene from={15.2} to={23.0}><KnowledgeBody /></Scene>;
}
function KnowledgeBody() {
  const { local } = useScene();
  const leave = Easing.inCubic(clamp((local - 2.0) / 2.0, 0, 1));
  const VW = 1040, VH = 520, OX = (1920 - VW) / 2, OY = 250;
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center' }}>
        <Kicker at={0.1} color={CLAY}>Risk 02 - Institutional knowledge</Kicker>
      </div>
      <div style={{ position: 'absolute', left: OX, top: OY, width: VW, height: VH }}>
        <svg width={VW} height={VH} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {EDGES.map(([a, b], i) => {
            const pa = NODES[a], pb = NODES[b];
            const appear = clamp((local - 0.6 - i * 0.08) / 0.5, 0, 1);
            return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={INK} strokeWidth="1.2" strokeOpacity={appear * 0.4} />;
          })}
        </svg>
        {NODES.map(n => {
          const appear = clamp((local - 0.4 - n.id * 0.07) / 0.5, 0, 1);
          const isLead = n.lead;
          const op = appear * (isLead ? (1 - leave) : 1);
          return (
            <div key={n.id} style={{ position: 'absolute', left: n.x, top: n.y, transform: 'translate(-50%,-50%)', opacity: op, textAlign: 'center' }}>
              <div style={{ width: n.r * 2, height: n.r * 2, borderRadius: '50%', background: isLead ? CLAY : INK, margin: '0 auto', boxShadow: isLead ? `0 0 22px ${CLAY}` : `0 0 14px rgba(12,17,22,0.12)` }} />
              <div style={{ fontFamily: SANS, fontSize: 14, color: isLead ? INK : MUTE, marginTop: 12, whiteSpace: 'pre-line', lineHeight: 1.3, letterSpacing: '0.01em', maxWidth: 180 }}>{n.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', bottom: 90, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={4.6} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 46, color: INK, letterSpacing: '-0.01em' }}>
            When they move on, <span style={{ color: CLAY, fontStyle: 'italic' }}>your history goes with them.</span>
          </div>
        </Rise>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 5 - the turn
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
            <Mask at={0.5}><span><span style={{ fontStyle: 'italic' }}>owned</span> all of it?</span></Mask>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 6 - Perry: lifecycle workflows + capabilities
function WorkflowCol({ num, title, steps, at }) {
  const { local } = useScene();
  const head = Easing.outCubic(clamp((local - at) / 0.7, 0, 1));
  return (
    <div style={{ flex: 1 }}>
      <div style={{ opacity: head, transform: `translateY(${(1 - head) * 22}px)`, minHeight: 110 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${LINE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 16, color: INK, marginBottom: 14 }}>{num}</div>
        <div style={{ fontFamily: SERIF, fontSize: 30, color: INK, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{title}</div>
      </div>
      <div style={{ position: 'relative', marginTop: 4 }}>
        <div style={{ position: 'absolute', left: 5, top: 8, bottom: 8, width: 1, background: LINE }} />
        {steps.map((s, i) => {
          const a = Easing.outCubic(clamp((local - (at + 0.45 + i * 0.13)) / 0.55, 0, 1));
          return (
            <div key={i} style={{ position: 'relative', display: 'flex', alignItems: 'center', paddingLeft: 30, marginBottom: 15, opacity: a, transform: `translateX(${(1 - a) * 14}px)` }}>
              <div style={{ position: 'absolute', left: 0, width: 10, height: 10, borderRadius: '50%', background: INK, boxShadow: `0 0 10px rgba(12,17,22,0.12)` }} />
              <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 19, color: 'rgba(12,17,22,0.82)' }}>{s}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function CapChip({ label, sub, at }) {
  const { local } = useScene();
  const a = Easing.outCubic(clamp((local - at) / 0.65, 0, 1));
  return (
    <div style={{ flex: 1, opacity: a, transform: `translateY(${(1 - a) * 18}px)` }}>
      <div style={{ background: 'rgba(12,17,22,0.03)', border: `1px solid ${LINE}`, borderRadius: 10, padding: '18px 20px' }}>
        <div style={{ fontFamily: SANS, fontWeight: 600, fontSize: 16, color: INK, marginBottom: 8 }}>{label}</div>
        <div style={{ fontFamily: SANS, fontSize: 16, color: MUTE, lineHeight: 1.45 }}>{sub}</div>
      </div>
    </div>
  );
}
function ScenePerry() {
  return <Scene from={44.8} to={59.0} fade={0.8}><PerryBody /></Scene>;
}
function PerryBody() {
  const { local } = useScene();
  const e = Easing.outExpo(clamp(local / 1.0, 0, 1));
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 96, left: 180, right: 180 }}>
        <Kicker at={0.1} color={MUTE}>Introducing</Kicker>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 30, marginTop: 18, opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>
          <PerryLogo size={80} />
          <div style={{ fontFamily: SERIF, fontSize: 30, fontStyle: 'italic', color: MUTE, paddingBottom: 12 }}>the Legal OS for private capital.</div>
        </div>
        <div style={{ height: 1, background: FAINT, marginTop: 32 }} />
      </div>
      <div style={{ position: 'absolute', left: 180, right: 180, top: 338 }}>
        <Rise at={0.7} y={14}>
          <div style={{ fontFamily: SANS, fontSize: 16, letterSpacing: '0.18em', textTransform: 'uppercase', color: MUTE, marginBottom: 22 }}>One platform &middot; the entire fund lifecycle</div>
        </Rise>
        <div style={{ display: 'flex', gap: 48 }}>
          <WorkflowCol num="1" title="Fund formation" steps={['Negotiation review', 'Term consolidation', 'MFN workflow', 'Operational handoff']} at={1.0} />
          <WorkflowCol num="2" title="Capital deployment" steps={['Transaction workflow', 'Market benchmarking', 'Diligence to action', 'Post-closing terms']} at={1.3} />
          <WorkflowCol num="3" title="Portfolio management" steps={['Ongoing work', 'Team collaboration', 'Legal Q&A', 'Portfolio visibility']} at={1.6} />
          <WorkflowCol num="4" title="Exit" steps={['Transfers & secondaries', 'Distributions', 'Wind-down', 'Final reporting']} at={1.9} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 180, right: 180, bottom: 116 }}>
        <Rise at={3.0} y={12}>
          <div style={{ height: 1, background: FAINT, marginBottom: 22 }} />
        </Rise>
        <div style={{ display: 'flex', gap: 20 }}>
          <CapChip label="Cross-border coverage" sub="Flags jurisdiction-specific clauses across DE, BE, NL and beyond." at={3.2} />
          <CapChip label="Benchmark to market" sub="NVCA, BVCA standards plus your own prior positions." at={3.45} />
          <CapChip label="Fully auditable" sub="Every AI and human action logged and editable. Nothing is a black box." at={3.7} />
          <CapChip label="One system, every role" sub="Investment, ops, compliance, finance, IR - all on the same page." at={3.95} />
        </div>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 6.5 - collaborate with outside counsel (spend reduces, not disappears)
function SceneCollab() {
  return <Scene from={59.0} to={65.8} fade={0.7}><CollabBody /></Scene>;
}
function CollabBody() {
  const { local } = useScene();
  const split = Easing.outCubic(clamp((local - 1.5) / 2.2, 0, 1));
  const perryPct = split * 0.66;
  const counselPct = 1 - perryPct;
  const barW = 1240, barX = (1920 - barW) / 2;
  const labels = Easing.outCubic(clamp((local - 2.4) / 0.7, 0, 1));
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', top: 92, left: 0, right: 0, textAlign: 'center' }}>
        <Kicker at={0.1} color={MUTE}>Perry &times; your outside counsel</Kicker>
      </div>
      <div style={{ position: 'absolute', top: 188, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={0.35} y={20}>
          <div style={{ fontFamily: SERIF, fontSize: 60, color: INK, lineHeight: 1.12, letterSpacing: '-0.015em' }}>
            We don't replace your law firms.<br /><span style={{ fontStyle: 'italic' }}>We reduce what you spend on them.</span>
          </div>
        </Rise>
      </div>
      <div style={{ position: 'absolute', left: barX, top: 478, width: barW }}>
        <div style={{ display: 'flex', height: 72, borderRadius: 14, overflow: 'hidden', border: `1px solid ${FAINT}`, background: PANEL }}>
          <div style={{ width: `${perryPct * 100}%`, background: INK, display: 'flex', alignItems: 'center', paddingLeft: 22, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 18, color: BG_D, opacity: clamp((perryPct - 0.16) / 0.12, 0, 1) }}>Handled in Perry</span>
          </div>
          <div style={{ width: `${counselPct * 100}%`, background: CLAY, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 22, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span style={{ fontFamily: SANS, fontWeight: 600, fontSize: 18, color: '#FFFFFF' }}>Outside counsel</span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, opacity: labels }}>
          <div style={{ fontFamily: SANS, fontSize: 19, color: MUTE, maxWidth: 520 }}>Routine, repeatable work - drafting, review, diligence, tracking.</div>
          <div style={{ fontFamily: SANS, fontSize: 19, color: 'hsla(172, 64%, 31%, 0.92)', maxWidth: 460, textAlign: 'right' }}>High-stakes judgment - a fraction of the spend.</div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 84, left: 0, right: 0, textAlign: 'center', padding: '0 200px' }}>
        <Rise at={3.4} y={18}>
          <div style={{ fontFamily: SERIF, fontSize: 40, color: INK, letterSpacing: '-0.01em' }}>
            Keep the relationships. <span style={{ fontStyle: 'italic' }}>Cut the spend.</span>
          </div>
        </Rise>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SCENE 7 - close
function SceneClose() {
  return <Scene from={65.8} to={71} fade={0}><CloseBody /></Scene>;
}
function CloseBody() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <PerryLogo size={168} />
      <div style={{ height: 1.5, background: LINE, width: 360, marginTop: 34, marginBottom: 36 }} />
      <div style={{ fontFamily: SERIF, fontSize: 44, fontStyle: 'italic', color: INK, letterSpacing: '-0.01em' }}>The Legal OS for Private Capital.</div>
      <div style={{ marginTop: 48 }}><DemoButton /></div>
      <div style={{ fontFamily: SANS, fontSize: 19, letterSpacing: '0.3em', color: MUTE, marginTop: 30, textTransform: 'uppercase' }}>useperry.com</div>
    </div>
  );
}

// ── root ────────────────────────────────────────────────────────────────────
function PerryVideo() {
  return (
    <Stage width={1920} height={1080} duration={71} background={BG}>
      <Atmosphere />
      <SceneOpen />
      <SceneCost />
      <SceneKnowledge />
      <SceneSecurity />
      <SceneFragmented />
      <SceneTurn />
      <ScenePerry />
      <SceneCollab />
      <SceneClose />
    </Stage>
  );
}

try { module.exports = { PerryVideo }; } catch (e) {}
window.PerryVideo = PerryVideo;
