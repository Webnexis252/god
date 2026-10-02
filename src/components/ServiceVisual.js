/* ─────────────────────────────────────────────────
   Service Visual
   • One schematic line drawing per service
   • Every shape is a <path>, so each one can be
     drawn in with a normalised dash (pathLength)
   • Shapes draw in the order they are listed
   • Set straight on the page with no frame, so the
     viewBox is trimmed to the artwork and the
     drawing keeps to the left edge of its column
   ───────────────────────────────────────────────── */

const line = (x1, y1, x2, y2) => `M${x1} ${y1}L${x2} ${y2}`;

const ring = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

// A ring that starts at twelve o'clock and runs clockwise, like a gauge filling.
const dial = (cx, cy, r) =>
  `M${cx} ${cy - r}a${r} ${r} 0 1 1 0 ${2 * r}a${r} ${r} 0 1 1 0 ${-2 * r}`;

const box = (x, y, w, h, r = 0) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}` +
  `a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}` +
  `v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

const windowChrome = [
  ["line", box(30, 18, 300, 164, 10)],
  ["soft", line(30, 46, 330, 46)],
  ["soft", ring(47, 32, 3.2)],
  ["soft", ring(59, 32, 3.2)],
  ["soft", ring(71, 32, 3.2)],
];

// Each entry is [tone, path], or ["text", string, x, y, size, anchor, tone].
const visuals = {
  // A wireframe with one block selected.
  "ui-ux-design": [
    ["line", box(40, 18, 280, 164, 10)],
    ["soft", line(40, 46, 320, 46)],
    ["line", ring(58, 32, 5)],
    ["soft", line(232, 32, 252, 32)],
    ["soft", line(262, 32, 282, 32)],
    ["soft", line(292, 32, 304, 32)],
    ["bold", line(60, 72, 166, 72)],
    ["bold", line(60, 86, 138, 86)],
    ["soft", line(60, 102, 174, 102)],
    ["soft", box(60, 114, 56, 16, 8)],
    ["soft", box(204, 64, 96, 62, 6)],
    ["soft", line(204, 64, 300, 126)],
    ["soft", line(300, 64, 204, 126)],
    ["soft", box(60, 146, 74, 24, 5)],
    ["soft", box(143, 146, 74, 24, 5)],
    ["soft", box(226, 146, 74, 24, 5)],
    ["accent", box(198, 58, 108, 74)],
    ["fill", box(195, 55, 6, 6)],
    ["fill", box(303, 55, 6, 6)],
    ["fill", box(195, 129, 6, 6)],
    ["fill", box(303, 129, 6, 6)],
    ["solid", "M312 136v17l4.6-4.2l3.2 7.4l3-1.3l-3.2-7.3h6.2z"],
  ],

  // A browser window: code on the left, a perfect score on the right.
  "web-development": [
    ...windowChrome,
    ["soft", box(92, 24, 168, 16, 8)],
    ["accent", line(52, 68, 84, 68)],
    ["line", line(92, 68, 132, 68)],
    ["soft", line(66, 82, 150, 82)],
    ["soft", line(66, 96, 122, 96)],
    ["line", line(80, 110, 108, 110)],
    ["soft", line(116, 110, 172, 110)],
    ["soft", line(80, 124, 146, 124)],
    ["soft", line(66, 138, 104, 138)],
    ["accent", line(52, 152, 76, 152)],
    ["soft", line(52, 166, 118, 166)],
    ["soft", line(206, 46, 206, 182)],
    ["soft", ring(268, 104, 34)],
    ["strong", dial(268, 104, 34)],
    ["text", "100", 268, 112, 24, "middle"],
    ["soft", line(244, 156, 292, 156)],
    ["soft", line(254, 167, 282, 167)],
  ],

  // One app across the spread of devices it has to survive on.
  "android-app-development": [
    ["soft", box(34, 48, 78, 112, 10)],
    ["soft", line(46, 66, 100, 66)],
    ["soft", box(46, 78, 54, 34, 5)],
    ["soft", line(46, 124, 88, 124)],
    ["soft", line(46, 136, 76, 136)],
    ["soft", box(256, 40, 68, 128, 12)],
    ["soft", ring(290, 51, 2.5)],
    ["soft", line(268, 70, 312, 70)],
    ["soft", box(268, 82, 44, 30, 5)],
    ["soft", line(268, 126, 304, 126)],
    ["soft", line(268, 138, 294, 138)],
    ["line", box(130, 12, 100, 176, 16)],
    ["soft", ring(180, 25, 3)],
    ["bold", line(144, 46, 188, 46)],
    ["soft", ring(152, 70, 7)],
    ["line", line(166, 66, 212, 66)],
    ["soft", line(166, 75, 196, 75)],
    ["soft", ring(152, 96, 7)],
    ["line", line(166, 92, 206, 92)],
    ["soft", line(166, 101, 200, 101)],
    ["soft", ring(152, 122, 7)],
    ["line", line(166, 118, 210, 118)],
    ["soft", line(166, 127, 190, 127)],
    ["fill", ring(204, 152, 12)],
    ["ink", line(199, 152, 209, 152)],
    ["ink", line(204, 147, 204, 157)],
    ["soft", line(164, 178, 196, 178)],
  ],

  // iPhone and iPad, side by side.
  "ios-app-development": [
    ["line", box(48, 12, 100, 176, 24)],
    ["line", box(82, 21, 32, 9, 4.5)],
    ["bold", line(62, 50, 112, 50)],
    ["soft", box(62, 62, 72, 40, 10)],
    ["soft", line(62, 119, 100, 119)],
    ["fill", box(112, 112, 22, 14, 7)],
    ["inkfill", ring(127, 119, 4.6)],
    ["soft", line(62, 136, 108, 136)],
    ["soft", line(48, 152, 148, 152)],
    ["soft", ring(70, 165, 4)],
    ["accent", ring(98, 165, 4)],
    ["soft", ring(126, 165, 4)],
    ["line", line(82, 180, 114, 180)],
    ["soft", box(176, 28, 150, 156, 14)],
    ["soft", line(222, 28, 222, 184)],
    ["soft", line(187, 52, 211, 52)],
    ["accent", line(187, 66, 207, 66)],
    ["soft", line(187, 80, 211, 80)],
    ["soft", line(187, 94, 203, 94)],
    ["bold", line(236, 52, 290, 52)],
    ["soft", box(236, 66, 76, 46, 8)],
    ["soft", box(236, 120, 34, 34, 8)],
    ["soft", box(278, 120, 34, 34, 8)],
    ["soft", line(236, 168, 298, 168)],
  ],

  // A trace with the offending line found, and the fix confirmed below it.
  "debugging-management": [
    ...windowChrome,
    ["soft", line(50, 64, 60, 64)],
    ["soft", line(70, 64, 214, 64)],
    ["soft", line(50, 80, 60, 80)],
    ["soft", line(82, 80, 250, 80)],
    ["accent", box(42, 89, 276, 20, 5)],
    ["accent", line(50, 99, 60, 99)],
    ["line", line(94, 99, 206, 99)],
    ["fill", ring(302, 99, 3.5)],
    ["soft", line(50, 118, 60, 118)],
    ["soft", line(82, 118, 232, 118)],
    ["soft", line(50, 134, 60, 134)],
    ["soft", line(70, 134, 176, 134)],
    ["soft", line(42, 150, 318, 150)],
    ["accent", "M50 165l5 5l9-11"],
    ["line", line(74, 166, 168, 166)],
    ["soft", line(178, 166, 236, 166)],
  ],

  // A search with the top result held.
  seo: [
    ["line", box(36, 18, 288, 36, 18)],
    ["accent", ring(60, 35, 7)],
    ["accent", line(65.2, 40.2, 71, 46)],
    ["line", line(84, 36, 176, 36)],
    ["accent", box(36, 68, 288, 38, 9)],
    ["text", "1", 56, 93, 16, "middle", "accent"],
    ["bold", line(76, 81, 180, 81)],
    ["soft", line(76, 94, 150, 94)],
    ["accent", "M252 96l12-5l10 3l13-12l15-7"],
    ["fill", ring(302, 75, 3)],
    ["text", "2", 56, 134, 16, "middle", "dim"],
    ["line", line(76, 123, 196, 123)],
    ["soft", line(76, 135, 160, 135)],
    ["soft", line(36, 147, 324, 147)],
    ["text", "3", 56, 170, 16, "middle", "dim"],
    ["line", line(76, 159, 172, 159)],
    ["soft", line(76, 171, 142, 171)],
  ],

  // A mark on its construction grid, with type and palette beside it.
  branding: [
    ["soft", box(36, 22, 136, 136)],
    ["soft", line(104, 22, 104, 158)],
    ["soft", line(36, 90, 172, 90)],
    ["soft", line(36, 22, 172, 158)],
    ["soft", line(172, 22, 36, 158)],
    ["line", ring(104, 90, 50)],
    ["soft", ring(104, 90, 28)],
    ["strong", "M74 66l15 48l15-34l15 34l15-48"],
    ["text", "Aa", 196, 84, 58, "start"],
    ["soft", line(198, 96, 324, 96)],
    ["fill", box(198, 112, 26, 26, 7)],
    ["solid", box(231, 112, 26, 26, 7)],
    ["tint", box(264, 112, 26, 26, 7)],
    ["soft", box(297, 112, 26, 26, 7)],
    ["soft", line(36, 174, 110, 174)],
    ["soft", line(198, 156, 296, 156)],
    ["soft", line(198, 168, 258, 168)],
  ],

  // A feed of posts over a reach line that keeps climbing.
  "social-media-marketing": [
    ["soft", box(30, 34, 86, 104, 10)],
    ["soft", box(40, 44, 66, 50, 6)],
    ["soft", line(40, 108, 96, 108)],
    ["soft", line(40, 120, 78, 120)],
    ["soft", box(244, 34, 86, 104, 10)],
    ["soft", box(254, 44, 66, 50, 6)],
    ["soft", line(254, 108, 310, 108)],
    ["soft", line(254, 120, 292, 120)],
    ["line", box(130, 16, 100, 136, 12)],
    ["soft", ring(146, 31, 5)],
    ["line", line(158, 31, 196, 31)],
    ["soft", box(140, 44, 80, 58, 6)],
    ["soft", "M140 94l24-22l18 16l12-9l26 19"],
    ["fill", "M150 126l-6.4-6.2a4.1 4.1 0 0 1 6.4-5.1a4.1 4.1 0 0 1 6.4 5.1z"],
    ["line", line(166, 119, 198, 119)],
    ["soft", line(142, 138, 206, 138)],
    ["accent", "M30 184L84 178L130 181L186 168L236 171L330 152"],
    ["fill", ring(330, 152, 3.5)],
  ],
};

// Where each drawing starts on the 360-wide artboard. The specimen sets them
// flush with the copy underneath, so the viewBox opens at this edge.
const leftEdge = {
  "ui-ux-design": 40,
  "web-development": 30,
  "android-app-development": 34,
  "ios-app-development": 48,
  "debugging-management": 30,
  seo: 36,
  branding: 36,
  "social-media-marketing": 30,
};

export default function ServiceVisual({ slug }) {
  const shapes = visuals[slug];

  if (!shapes) {
    return null;
  }

  return (
    <div className="service-visual">
      <svg
        viewBox={`${(leftEdge[slug] ?? 30) - 1} 8 304 184`}
        preserveAspectRatio="xMinYMin meet"
        fill="none"
        focusable="false"
      >
        {shapes.map(([tone, ...rest], index) => {
          if (tone === "text") {
            const [label, x, y, size, anchor, textTone = "solid"] = rest;

            return (
              <text
                key={index}
                className={`service-visual-text is-${textTone}`}
                x={x}
                y={y}
                fontSize={size}
                textAnchor={anchor}
                style={{ "--i": index }}
              >
                {label}
              </text>
            );
          }

          return (
            <path
              key={index}
              className={`service-visual-shape is-${tone}`}
              d={rest[0]}
              pathLength="1"
              style={{ "--i": index }}
            />
          );
        })}
      </svg>
    </div>
  );
}
