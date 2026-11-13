import { useId } from "react";

/* Hand-sketched map pin (pure SVG): wobbly pencil outline + shading */

const OUTER = "M50 118 C 38 96, 16 74, 16 44 A 34 34 0 1 1 84 44 C 84 74, 62 96, 50 118 Z";

// Diagonal pencil strokes, slightly uneven like real shading
const HATCH = Array.from({ length: 34 }, (_, i) => {
  const x = (-60 + i * 4.2).toFixed(1);
  const x2 = (60 + i * 4.2).toFixed(1);
  const wob = ((i * 37) % 7) - 3;
  return `M${x} ${130 + wob} L${x2} ${10 - wob}`;
});

export default function SketchPin({
  color = "currentColor",
  className = "",
}: {
  /** Pencil colour ("currentColor" follows the text colour) */
  color?: string;
  className?: string;
}) {
  // Unique id per pin so several pins on one page don't clash
  const id = "pin" + useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg
      viewBox="8 2 84 120"
      width={14}
      height={18}
      className={`${className} shrink-0 overflow-visible`}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        {/* Shade the left and lower part of the pin, not the hole */}
        <mask id={id}>
          <path d={OUTER} fill="#fff" stroke="none" />
          <circle cx="50" cy="42" r="20" fill="#000" stroke="none" />
          <path d="M34 0 L100 0 L100 130 L64 130 L58 66 Z" fill="#000" stroke="none" />
        </mask>
      </defs>

      <g mask={`url(#${id})`} strokeWidth="1.5" opacity="0.85">
        {HATCH.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Outline drawn three times, slightly off, like a quick pencil sketch */}
      <path d={OUTER} strokeWidth="3.2" />
      <path d={OUTER} strokeWidth="1.6" transform="translate(1.8 -1.4) rotate(1.8 50 60)" />
      <path d={OUTER} strokeWidth="1.2" transform="translate(-1.2 0.8) rotate(-1.2 50 60)" />
      <circle cx="50" cy="42" r="15" strokeWidth="3" />
      <circle cx="51" cy="41" r="16.8" strokeWidth="1.5" />
    </svg>
  );
}