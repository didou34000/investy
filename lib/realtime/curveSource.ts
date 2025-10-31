export interface CurveSourceOptions {
  points?: number;
  fps?: number;
  seed?: number;
  websocketUrl?: string;
}

export interface CurveSource {
  getPositions(): Float32Array;
  dispose(): void;
}

// Lightweight smooth pseudo-noise (avoids external deps)
function smoothNoise(x: number, t: number, seed: number): number {
  const a = Math.sin((x * 3.1 + t * 0.6) + seed * 0.7);
  const b = Math.cos((x * 1.7 - t * 0.3) + seed * 1.3);
  return (a + b) * 0.25; // keep small amplitude
}

export function createCurveSource(opts: CurveSourceOptions = {}): CurveSource {
  const points = Math.max(32, Math.min(20000, Math.floor(opts.points ?? 600)));
  const fps = Math.max(1, Math.min(120, Math.floor(opts.fps ?? 30)));
  const seed = opts.seed ?? 42;
  const dtMs = 1000 / fps;

  const positions = new Float32Array(points * 3);
  const xs = new Float32Array(points);

  // Precompute x coordinates from -1 to +1
  for (let i = 0; i < points; i++) {
    const x = -1 + (2 * i) / (points - 1);
    xs[i] = x;
    const y = 0;
    const z = 0;
    const j = i * 3;
    positions[j] = x;
    positions[j + 1] = y;
    positions[j + 2] = z;
  }

  let t = 0; // time in seconds
  let lastUpdate = performance.now();
  let disposed = false;

  // Optional WebSocket input
  let ws: WebSocket | null = null;
  const queue: number[] = [];
  if (opts.websocketUrl) {
    try {
      ws = new WebSocket(opts.websocketUrl);
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(String(ev.data));
          if (typeof data?.y === 'number') queue.push(data.y);
        } catch {}
      };
    } catch {}
  }

  function sampleY(time: number, x: number): number {
    // Base wave + smooth pseudo-noise; clamp amplitude
    const base = Math.sin(time * 1.2 + x * 5.0) * 0.35;
    const n = smoothNoise(x * 2.0, time, seed);
    return base + n;
  }

  function nextSample(time: number): { y: number; z: number } {
    if (queue.length > 0) {
      const yv = queue.shift() as number;
      return { y: Math.max(-1, Math.min(1, yv)), z: 0.02 * Math.sin(time * 0.8) };
    }
    // Organic new value at the right end (x=+1 slot)
    const y = sampleY(time, 1);
    const z = 0.02 * Math.sin(time * 0.8);
    return { y, z };
  }

  function tick(now: number) {
    const elapsed = now - lastUpdate;
    if (elapsed < dtMs) return;
    const steps = Math.min(4, Math.floor(elapsed / dtMs)); // clamp to avoid spiral on tab refocus
    for (let s = 0; s < steps; s++) {
      t += dtMs / 1000;
      // Shift Y,Z left by one, keep X fixed
      for (let i = 0; i < points - 1; i++) {
        const j = i * 3;
        const k = j + 3;
        positions[j + 1] = positions[k + 1];
        positions[j + 2] = positions[k + 2];
      }
      // Write new tail sample at last index
      const tail = nextSample(t);
      const j = (points - 1) * 3;
      positions[j] = xs[points - 1]; // x stays at +1
      positions[j + 1] = tail.y;
      positions[j + 2] = tail.z;
    }
    lastUpdate = now;
  }

  function getPositions(): Float32Array {
    if (disposed) return positions;
    tick(performance.now());
    return positions;
  }

  function dispose() {
    disposed = true;
    try { ws?.close(); } catch {}
    ws = null;
  }

  // Initialize with a smooth curve
  const now0 = performance.now();
  lastUpdate = now0 - dtMs;
  tick(now0);

  return { getPositions, dispose };
}






