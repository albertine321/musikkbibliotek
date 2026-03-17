export default function Personvern() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #f5f0ff 0%, #eef2ff 60%, #f0f4ff 100%)',
      fontFamily: 'Georgia, serif',
      color: '#1a1060',
    }}>

      {/* Tilbake-knapp */}
      <div style={{ padding: '24px 40px 0' }}>
        <a href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '0.82rem', color: '#7c6bbf', textDecoration: 'none',
          fontFamily: 'inherit', fontWeight: '600',
        }}>
          ← Tilbake til biblioteket
        </a>
      </div>

      {/* Innhold */}
      <div style={{
        maxWidth: '700px',
        margin: '40px auto',
        padding: '0 32px 80px',
      }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔒</div>
          <h1 style={{
            margin: '0 0 10px',
            fontSize: '2.2rem',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            color: '#1a1060',
          }}>Personvernserklæring</h1>
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: '#9090b8',
            fontFamily: 'system-ui, sans-serif',
          }}>Sist oppdatert: {new Date().toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Seksjoner */}
        {[
          {
            tittel: '1. Om denne siden',
            tekst: `Musikkbiblioteket er en personlig nettside som viser en privat platesamling. 
            Siden er ikke kommersiell og samler ikke inn personopplysninger fra besøkende.`,
          },
          {
            tittel: '2. Hvilke data samles inn',
            tekst: `Denne siden samler ikke inn personopplysninger om besøkende. 
            Det finnes ingen brukerregistrering, ingen kommentarfelt og ingen sporingsverktøy som Google Analytics.`,
          },
          {
            tittel: '3. Informasjonskapsler (cookies)',
            tekst: `Siden bruker ikke informasjonskapsler for sporing eller markedsføring. 
            Det brukes ingen tredjeparts annonsenettverk eller sosiale medier-sporere.`,
          },
          {
            tittel: '4. Tredjeparts tjenester',
            tekst: `Siden viser QR-koder og Spotify Codes som lenker til Spotify. 
            Når du skanner en QR-kode og åpner Spotify, er du underlagt Spotifys egne personvernregler. 
            Vi har ingen kontroll over data som samles inn av Spotify.`,
          },
          {
            tittel: '5. Hosting og server',
            tekst: `Siden kjøres lokalt og er ikke publisert på internett. 
            Ingen ekstern hosting-leverandør behandler dine data i forbindelse med dette nettstedet.`,
          },
          {
            tittel: '6. Kontakt',
            tekst: `Har du spørsmål om personvern på denne siden, ta kontakt med eieren av siden direkte.`,
          },
        ].map(({ tittel, tekst }) => (
          <div key={tittel} style={{ marginBottom: '36px' }}>
            <h2 style={{
              margin: '0 0 10px',
              fontSize: '1.05rem',
              fontWeight: '700',
              color: '#2d1b8e',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '-0.01em',
            }}>{tittel}</h2>
            <p style={{
              margin: 0,
              fontSize: '0.95rem',
              lineHeight: '1.75',
              color: '#3a3060',
              fontFamily: 'system-ui, sans-serif',
            }}>{tekst}</p>
            <div style={{ height: '1px', background: 'rgba(124,107,191,0.15)', marginTop: '28px' }} />
          </div>
        ))}

      </div>

      {/* Footer-linje */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1060 0%, #2d1b8e 100%)',
        padding: '20px 40px',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'system-ui, sans-serif',
      }}>
        🎵 Musikkbibliotek · Personvernserklæring
      </div>
    </div>
  );
}