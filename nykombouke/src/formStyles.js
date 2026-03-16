export const inp = {
  width: '100%',
  padding: '6px 10px',
  borderRadius: '8px',
  border: '1.5px solid #e0e0e0',
  fontSize: '0.82rem',
  color: '#4c4c4cff',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export const lbl = {
  fontSize: '0.6rem',
  fontWeight: '700',
  color: '#110955',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '3px',
  display: 'block',
};

export const EMPTY_FORM = {
  tittel: '',
  artist_navn: '',
  utgivelsesaar: '',
  bilde_url: '',
  spotify_url: '',
  spotify_code_bilde: '',
};

export function F({ label, mb = 8, children }) {
  return (
    <div style={{ marginBottom: mb }}>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}