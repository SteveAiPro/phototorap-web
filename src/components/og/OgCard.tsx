/**
 * Shared Open Graph card template for PhotoToRap route segments.
 * Rendered at request/build time by next/og (Satori) — 1200x630 PNG.
 */
export interface OgCardProps {
  badge: string;
  title: string;
  /** Accent-colored second line of the title (e.g. "Generator") */
  titleAccent?: string;
  subtitle: string;
  footerNote?: string;
}

export function OgCard({
  badge,
  title,
  titleAccent,
  subtitle,
  footerNote = 'Free preview · 10 free credits on sign-in',
}: OgCardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#090A0F',
        backgroundImage:
          'radial-gradient(circle at 85% 15%, rgba(255,106,0,0.22) 0%, rgba(9,10,15,0) 45%), radial-gradient(circle at 10% 90%, rgba(255,106,0,0.10) 0%, rgba(9,10,15,0) 40%)',
        padding: '64px 72px',
        fontFamily: 'sans-serif',
        color: '#F3F4F6',
      }}
    >
      {/* Header: brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #FF6A00 0%, #FF9E4D 100%)',
            fontSize: '30px',
            fontWeight: 800,
            color: '#0A0A0A',
          }}
        >
          P
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '0.5px' }}>
            PhotoToRap <span style={{ color: '#FF6A00' }}>AI</span>
          </span>
          <span style={{ fontSize: '19px', color: '#9CA3AF', marginTop: '2px' }}>
            {badge}
          </span>
        </div>
      </div>

      {/* Title block */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            display: 'flex',
            fontSize: '76px',
            fontWeight: 900,
            lineHeight: 1.08,
            letterSpacing: '-1.5px',
            maxWidth: '980px',
          }}
        >
          {title}
          {titleAccent ? (
            <span style={{ color: '#FF6A00' }}>&nbsp;{titleAccent}</span>
          ) : null}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '30px',
            color: '#D1D5DB',
            lineHeight: 1.35,
            maxWidth: '900px',
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '26px',
            color: '#9CA3AF',
          }}
        >
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '999px',
              background: '#FF6A00',
            }}
          />
          phototorap.com
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '22px',
            color: '#6B7280',
            border: '1px solid #222533',
            borderRadius: '999px',
            padding: '10px 24px',
          }}
        >
          {footerNote}
        </div>
      </div>
    </div>
  );
}
