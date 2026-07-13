// ProTimer Studio — smoke test-display resolver (no dependencies).
// Chooses the monitor that smoke/test windows must stay on. Selection order:
//   1. --smoke-display-id=<id>  / env PROTIMER_SMOKE_DISPLAY_ID / config.id
//   2. --smoke-display=<substr> / env PROTIMER_SMOKE_DISPLAY    / config.labelContains
//   3. built-in default label substrings ["PHL","Philips"] (a Philips monitor reports "PHL...")
// Never selects by position, array order, or "not primary". Never hardcodes a display ID.
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const a = {};
  (argv || []).forEach((s) => {
    let m;
    if ((m = /^--smoke-display=(.+)$/.exec(s))) a.label = m[1];
    else if ((m = /^--smoke-display-id=(.+)$/.exec(s))) a.id = m[1];
  });
  return a;
}

function readConfig(root) {
  try { return JSON.parse(fs.readFileSync(path.join(root, '.protimer-smoke-display.json'), 'utf8')); }
  catch (e) { return {}; }
}

// screen: Electron screen module. Returns {display|null, requested, available[]}.
function resolveTargetDisplay(screen, opts) {
  opts = opts || {};
  const argv = opts.argv || process.argv;
  const env = opts.env || process.env;
  const root = opts.root || path.join(__dirname, '..');
  const cli = parseArgs(argv);
  const cfg = readConfig(root);
  const displays = screen.getAllDisplays();
  const primaryId = screen.getPrimaryDisplay().id;
  const available = displays.map((d) => ({ id: d.id, label: d.label || '', primary: d.id === primaryId }));

  const wantId = cli.id || env.PROTIMER_SMOKE_DISPLAY_ID || (cfg && cfg.id);
  const wantLabel = cli.label || env.PROTIMER_SMOKE_DISPLAY || (cfg && cfg.labelContains);

  let display = null;
  let requested;
  let matches = [];
  let ambiguous = false;
  if (wantId) {
    requested = 'id:' + wantId;
    display = displays.find((d) => String(d.id) === String(wantId)) || null;
    if (display) matches = [display];
  } else {
    const subs = wantLabel ? [String(wantLabel)] : ['PHL', 'Philips'];
    requested = 'label~' + subs.join('|');
    const has = (d, sub) => (d.label || '').toLowerCase().includes(String(sub).toLowerCase());
    matches = displays.filter((d) => subs.some((sub) => has(d, sub)));
    // convenience: "Philips" also matches the "PHL" that Philips monitors report
    if (!matches.length && wantLabel && String(wantLabel).toLowerCase() === 'philips') {
      matches = displays.filter((d) => has(d, 'phl'));
    }
    // >1 label match: ABORT-level ambiguity — never silently pick the first monitor.
    // Caller must use an explicit --smoke-display-id / config id.
    if (matches.length > 1) { ambiguous = true; display = null; }
    else display = matches[0] || null;
  }
  return { display, requested, available, matches: matches.map((d) => ({ id: d.id, label: d.label || '' })), ambiguous };
}

// window bounds fully inside a workArea/bounds rect (with tolerance).
function insideRect(b, rect, tol) {
  tol = tol == null ? 1 : tol;
  return b.x >= rect.x - tol && b.y >= rect.y - tol &&
         b.x + b.width <= rect.x + rect.width + tol &&
         b.y + b.height <= rect.y + rect.height + tol;
}

// two rects overlap (used to prove a window is NOT on another monitor).
function rectsOverlap(a, b, tol) {
  tol = tol == null ? 1 : tol;
  return !(a.x + a.width <= b.x + tol || b.x + b.width <= a.x + tol ||
           a.y + a.height <= b.y + tol || b.y + b.height <= a.y + tol);
}

// clamp a requested size to a workArea and center it there.
function clampToWorkArea(size, wa) {
  const w = Math.min(size.width, wa.width);
  const h = Math.min(size.height, wa.height);
  return { x: wa.x + Math.max(0, Math.floor((wa.width - w) / 2)),
           y: wa.y + Math.max(0, Math.floor((wa.height - h) / 2)),
           width: w, height: h };
}

module.exports = { resolveTargetDisplay, insideRect, rectsOverlap, clampToWorkArea, parseArgs, readConfig };
