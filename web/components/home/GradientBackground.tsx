export function GradientBackground() {
  const accentColor = '#55A2C3';
  const accentRgba = '85, 162, 195'; // RGB values for #55A2C3

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated mesh gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(at 0% 0%, rgba(${accentRgba}, 0.1) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(${accentRgba}, 0.08) 0px, transparent 50%),
            radial-gradient(at 100% 100%, rgba(${accentRgba}, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(${accentRgba}, 0.08) 0px, transparent 50%)
          `,
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, transparent 0%, hsl(var(--background)) 100%)',
        }}
      />
    </div>
  );
}
