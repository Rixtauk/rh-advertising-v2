export function FloatingOrbs() {
  const accentColor = '#55A2C3';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Accent orb 1 */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          top: '10%',
          left: '10%',
        }}
      />

      {/* Accent orb 2 */}
      <div
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-20 animate-float-delayed"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          top: '40%',
          right: '15%',
        }}
      />

      {/* Accent orb 3 */}
      <div
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-20 animate-float"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          bottom: '15%',
          left: '20%',
          animationDelay: '1s',
        }}
      />

      {/* Additional small orbs for depth */}
      <div
        className="absolute w-64 h-64 rounded-full blur-2xl opacity-15 animate-float-delayed"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          top: '60%',
          right: '40%',
        }}
      />

      <div
        className="absolute w-56 h-56 rounded-full blur-2xl opacity-15 animate-float"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          bottom: '30%',
          right: '10%',
          animationDelay: '3s',
        }}
      />
    </div>
  );
}
