import { useRef, useEffect } from 'react';

const SIZE = 96; // cursor diameter in px
const LERP = 0.13; // smoothing (lower = more lag, higher = snappier)

/**
 * Generates a spherical lens displacement map as a data URL.
 * R channel = horizontal shift, G channel = vertical shift.
 * Values near 128 = no shift. < 128 = shift left/up. > 128 = shift right/down.
 */
function makeLensMap(size: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const d = img.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x / size) * 2 - 1; // [-1, 1]
      const ny = (y / size) * 2 - 1; // [-1, 1]
      const r2 = nx * nx + ny * ny;

      let r = 128, g = 128;

      if (r2 < 1) {
        const nz = Math.sqrt(1 - r2); // z of unit sphere normal
        // Convex lens: push pixels outward from center (inward refraction appearance)
        const strength = (1 - nz) * 80;
        r = Math.round(128 + nx * strength);
        g = Math.round(128 + ny * strength);
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
      }

      const i = (y * size + x) * 4;
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL('image/png');
}

export default function FluidGlassCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -300, y: -300 });
  const target = useRef({ x: -300, y: -300 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Only activate on desktop with a fine pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.innerWidth < 900) return;

    // Inject lens displacement map into the SVG filter
    const url = makeLensMap(256);
    const feImg = document.getElementById('gc-feimage');
    if (feImg) feImg.setAttribute('href', url);

    document.body.classList.add('glass-cursor-active');

    // Track raw mouse position
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    // Smooth lerp animation loop
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * LERP;
      pos.current.y += (target.current.y - pos.current.y) * LERP;

      if (cursorRef.current) {
        const tx = pos.current.x - SIZE / 2;
        const ty = pos.current.y - SIZE / 2;
        cursorRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
      }

      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('glass-cursor-active');
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* ─── SVG filter definition (hidden, zero size) ─── */}
      {/* backdrop-filter: url(#gc-filter) distorts the actual HTML content behind the cursor */}
      <svg
        aria-hidden="true"
        style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <defs>
          <filter
            id="gc-filter"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            {/* Lens displacement map will be populated by useEffect */}
            <feImage
              id="gc-feimage"
              result="lensMap"
              x="0"
              y="0"
              width={SIZE}
              height={SIZE}
              preserveAspectRatio="none"
            />
            {/*
              scale: negative = inward refraction (glass bulging toward viewer).
              Increase magnitude for stronger distortion.
            */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="lensMap"
              scale="-55"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* ─── The glass cursor element ─── */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: SIZE,
          height: SIZE,
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          // This is the magic: distorts the real HTML content underneath
          backdropFilter: 'url(#gc-filter) brightness(1.06) saturate(1.15)',
          WebkitBackdropFilter: 'url(#gc-filter) brightness(1.06) saturate(1.15)',
          // Glass appearance
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.45)',
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.4)',
            'inset 0 -1px 0 rgba(0,0,0,0.06)',
            '0 8px 32px rgba(0,0,0,0.12)',
          ].join(', '),
        }}
      />
    </>
  );
}
