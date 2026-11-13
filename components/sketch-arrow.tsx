/* Hand-drawn, scribble-filled arrows (pure SVG, no images).
   shape="curve": big swoosh pointing up-right (decorations)
   shape="dash":  small, nearly straight arrow pointing right (buttons & links)
   Use `rotate` / `flip` to aim them. */

type Pt = [number, number];

const f = (n: number) => n.toFixed(1);
// Fixed "random" wobble so server and browser draw the exact same lines
const wobble = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x) - 0.5;
};
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const line = (pts: Pt[], seed = 0, shake = 0.9) =>
  "M" + pts.map((p, i) => `${f(p[0] + wobble(i + seed) * shake)} ${f(p[1] + wobble(i + seed + 50) * shake)}`).join(" L");

type Spec = { P0: Pt; P1: Pt; P2: Pt; w0: number; w1: number; head: number; half: number; steps: number };

function buildArrow({ P0, P1, P2, w0, w1, head, half, steps }: Spec) {
  const at = (t: number): Pt => [
    (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
    (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
  ];
  const dir = (t: number): Pt => {
    const x = 2 * (1 - t) * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
    const y = 2 * (1 - t) * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
    const l = Math.hypot(x, y);
    return [x / l, y / l];
  };

  // Shaft: two edges that widen towards the head, scribbled in between
  const left: Pt[] = [];
  const right: Pt[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const [x, y] = at(t);
    const [dx, dy] = dir(t);
    const w = w0 + t * (w1 - w0);
    left.push([x - dy * w, y + dx * w]);
    right.push([x + dy * w, y - dx * w]);
  }
  const zig = left.map((p, i) => (i % 2 ? p : right[i]));

  // Head: triangle, scribbled from the base to the tip
  const [dx, dy] = dir(1);
  const tip: Pt = [P2[0] + dx * head, P2[1] + dy * head];
  const A: Pt = [P2[0] - dy * half, P2[1] + dx * half];
  const B: Pt = [P2[0] + dy * half, P2[1] - dx * half];
  const K = 24;
  const headZig: Pt[] = [];
  for (let k = 0; k <= K; k++) {
    const t = (k / K) * 0.92;
    headZig.push(k % 2 ? lerp(A, tip, t) : lerp(B, tip, t));
  }

  return {
    edges: [line(left, 1), line(right, 7), line(left, 13, 1.6), line(right, 19, 1.6)],
    fill: [line(zig, 3, 0.6), line(headZig, 5, 0.6)],
    head: [
      line([A, tip, B, A], 9, 1.2),
      line([lerp(B, A, -0.15), lerp(tip, A, -0.18)], 21, 0.5),
      line([A, lerp(A, tip, 1.12)], 25, 0.5),
    ],
  };
}

const SHAPES = {
  curve: {
    paths: buildArrow({ P0: [12, 112], P1: [26, 50], P2: [78, 34], w0: 1.5, w1: 9, head: 34, half: 19, steps: 48 }),
    viewBox: "-4 -6 130 128",
  },
  dash: {
    paths: buildArrow({ P0: [6, 64], P1: [46, 50], P2: [84, 57], w0: 2, w1: 7, head: 30, half: 17, steps: 30 }),
    viewBox: "0 30 122 56",
  },
};

export default function SketchArrow({
  shape = "curve",
  color = "#0A0A0A",
  outline,
  rotate = 0,
  flip = false,
  weight = 1,
  className = "w-full h-full",
}: {
  /** "curve" = big swoosh, "dash" = small arrow for buttons and links */
  shape?: keyof typeof SHAPES;
  /** Scribble colour ("currentColor" follows the text colour) */
  color?: string;
  /** Optional darker edge behind the scribble (use with lime on white) */
  outline?: string;
  /** Turn the arrow, in degrees (0 = its normal direction) */
  rotate?: number;
  /** Mirror left-to-right (e.g. a "back" arrow) */
  flip?: boolean;
  /** Line thickness multiplier: raise it for small icons */
  weight?: number;
  className?: string;
}) {
  const { paths, viewBox } = SHAPES[shape];
  const all = [...paths.edges, ...paths.head, ...paths.fill];
  return (
    <svg
      viewBox={viewBox}
      width={24}
      height={shape === "dash" ? 12 : 24}
      className={`${className} overflow-visible`}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g transform={`rotate(${rotate} 61 58)${flip ? " translate(122 0) scale(-1 1)" : ""}`}>
        {outline && all.map((d, i) => <path key={`o${i}`} d={d} stroke={outline} strokeWidth={3.6 * weight} />)}
        {paths.edges.map((d, i) => <path key={`e${i}`} d={d} stroke={color} strokeWidth={1.8 * weight} />)}
        {paths.fill.map((d, i) => <path key={`f${i}`} d={d} stroke={color} strokeWidth={1.2 * weight} />)}
        {paths.head.map((d, i) => <path key={`h${i}`} d={d} stroke={color} strokeWidth={2 * weight} />)}
      </g>
    </svg>
  );
}