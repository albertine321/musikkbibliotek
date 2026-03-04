import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ScrollStackItem } from './ScrollStack';
import { inp, lbl, F } from './formStyles';

const genererSpotifyCode = (spotifyUrl) => {
  try {
    const deler = spotifyUrl.split('/');
    const type = deler[deler.length - 2];
    const id = deler[deler.length - 1].split('?')[0];
    return `https://scannables.scdn.co/uri/plain/png/ffffff/black/640/spotify:${type}:${id}`;
  } catch { return ''; }
};

export default function AlbumCard({ album, onDeleted, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    tittel: album.tittel || '',
    artist_navn: album.artist_navn || '',
    utgivelsesaar: album.utgivelsesaar || '',
    bilde_url: album.bilde_url || '',
    spotify_url: album.spotify_url || '',
    spotify_code_bilde: album.spotify_code_bilde || '',
  });
  const [saveStatus, setSaveStatus] = useState(null); // 'loading' | 'error'
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const confirmTimer = useRef(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => {
      const oppdatert = { ...p, [name]: value };
      if (name === 'spotify_url') {
        oppdatert.spotify_code_bilde = value ? genererSpotifyCode(value) : '';
      }
      return oppdatert;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm((p) => ({ ...p, bilde_url: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaveStatus('loading');
    try {
      const res = await fetch(`/musikk/${album.album_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Lagring feilet');
      setEditing(false);
      setSaveStatus(null);
      onUpdated?.();
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  const handleCancel = () => {
    setForm({
      tittel: album.tittel || '',
      artist_navn: album.artist_navn || '',
      utgivelsesaar: album.utgivelsesaar || '',
      bilde_url: album.bilde_url || '',
      spotify_url: album.spotify_url || '',
      spotify_code_bilde: album.spotify_code_bilde || '',
    });
    setEditing(false);
    setSaveStatus(null);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      confirmTimer.current = setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    clearTimeout(confirmTimer.current);
    setDeleting(true);
    try {
      const res = await fetch(`/musikk/${album.album_id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Sletting feilet');
      onDeleted?.();
    } catch (err) {
      console.error(err);
      setDeleting(false); setConfirmDelete(false);
    }
  };

  /* ── Visningsmodurs ── */
  if (!editing) {
    return (
      <ScrollStackItem>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

          {album.bilde_url && (
            <img src={album.bilde_url} alt={album.tittel} style={{
              width: '200px', height: '200px', borderRadius: '12px', marginTop: '10px',
              objectFit: 'cover', filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))', flexShrink: 0,
            }} />
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <h2 style={{ marginBottom: '5px' }}>{album.tittel || 'Ukjent album'}</h2>
              <p style={{ margin: '4px 0' }}>🎤 {album.artist_navn || 'Ukjent artist'}</p>
              <p style={{ margin: '4px 0' }}>📅 {album.utgivelsesaar || 'Ukjent år'}</p>
            </div>

            {album.spotify_code_bilde && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', paddingBottom: '20px' }}>
                <img src={album.spotify_code_bilde} alt="Spotify Code"
                  style={{ width: '200px', height: 'auto', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }} />
                <p style={{ fontSize: '0.8rem', margin: 0, color: '#666', fontWeight: '500' }}>Skann i Spotify</p>
              </div>
            )}
          </div>

          {/* Høyre: QR + knapper */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '10px', flexShrink: 0, marginTop: '10px', marginRight: '4px', minWidth: '120px',
          }}>
            {album.spotify_url ? (
              <>
                <QRCodeSVG value={album.spotify_url} size={120} level="M"
                  style={{ filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))' }} />
                <p style={{ fontSize: '0.75rem', margin: 0, color: '#666', fontWeight: '500' }}>Skann QR fra kamera</p>
              </>
            ) : (
              <div style={{ width: 120, height: 120 }} />
            )}

            <button onClick={() => setEditing(true)} style={{
              padding: '8px 0', borderRadius: '12px', border: 'none',
              background: '#f0f0f0', color: '#555',
              fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer',
              width: '120px', transition: 'all 0.2s',
            }}>✏️ Rediger</button>

            <button onClick={handleDelete} disabled={deleting} style={{
              padding: '8px 0', borderRadius: '12px', border: 'none',
              background: confirmDelete ? '#e74c3c' : '#f0f0f0',
              color: confirmDelete ? '#fff' : '#aaa',
              fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer',
              transition: 'all 0.2s', width: '120px',
              boxShadow: confirmDelete ? '0 3px 10px rgba(231,76,60,0.35)' : 'none',
            }}>
              {deleting ? '⏳ Sletter…' : confirmDelete ? '⚠️ Bekreft?' : '🗑️ Slett'}
            </button>
          </div>
        </div>
      </ScrollStackItem>
    );
  }

  /* ── Redigeringsmodus ── */
  return (
    <ScrollStackItem>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '40px',
        background: 'linear-gradient(135deg, #fff8ee 0%, #fff3e0 100%)', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px', height: '100%' }}>

        {/* VENSTRE – bilde */}
        <div style={{ width: '160px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: '120px', height: '120px', borderRadius: '12px', margin: '0 auto',
              background: form.bilde_url ? 'transparent' : 'rgba(255,255,255,0.7)',
              border: '2px dashed #f0c070', overflow: 'hidden', position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
          >
            {form.bilde_url ? (
              <img src={form.bilde_url} alt="preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setForm((p) => ({ ...p, bilde_url: '' }))} />
            ) : (
              <>
                <span style={{ fontSize: '1.6rem' }}>🖼️</span>
                <span style={{ fontSize: '0.6rem', color: '#c8a870', marginTop: '4px', textAlign: 'center' }}>Klikk for å endre</span>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

          <F label="Bilde-URL" mb={0}>
            <input style={inp} name="bilde_url" value={form.bilde_url}
              onChange={handleChange} placeholder="https://…" />
          </F>
        </div>

        {/* MIDTRE – tekstfelter */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
          <div style={{ marginBottom: '10px' }}>
            <h2 style={{ margin: 0, color: '#7a4a00', fontSize: '1.15rem', fontWeight: '700' }}>✏️ Rediger album</h2>
          </div>

          <F label="Albumtittel *" mb={7}>
            <input style={inp} name="tittel" value={form.tittel} onChange={handleChange} placeholder="f.eks. Abbey Road" />
          </F>
          <F label="🎤 Artist *" mb={7}>
            <input style={inp} name="artist_navn" value={form.artist_navn} onChange={handleChange} placeholder="f.eks. The Beatles" />
          </F>
          <F label="📅 Utgivelsesår" mb={7}>
            <input style={inp} name="utgivelsesaar" value={form.utgivelsesaar}
              onChange={handleChange} placeholder="f.eks. 1969" type="number" />
          </F>
          <F label="Spotify URL" mb={0}>
            <input style={inp} name="spotify_url" value={form.spotify_url}
              onChange={handleChange} placeholder="https://open.spotify.com/…" />
          </F>
        </div>

        {/* HØYRE – QR-forhåndsvisning + lagre/avbryt */}
        <div style={{
          width: '120px', flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '8px', marginRight: '4px',
        }}>
          {form.spotify_url ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <QRCodeSVG value={form.spotify_url} size={90} level="M"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />
              <span style={{ fontSize: '0.6rem', color: '#bbb' }}>QR-forhåndsvisning</span>
            </div>
          ) : (
            <div style={{
              width: 90, height: 90, borderRadius: '10px', flexShrink: 0,
              background: 'rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '1.4rem', opacity: 0.2 }}>📷</span>
            </div>
          )}

          <button onClick={handleSave} disabled={saveStatus === 'loading'} style={{
            width: '100%', padding: '9px', borderRadius: '12px', border: 'none',
            background: '#e67e00', color: '#fff',
            fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer',
            transition: 'all 0.2s', boxShadow: '0 3px 10px rgba(230,126,0,0.35)',
          }}>
            {saveStatus === 'loading' ? '⏳…' : '💾 Lagre'}
          </button>

          <button onClick={handleCancel} style={{
            width: '100%', padding: '8px', borderRadius: '12px', border: 'none',
            background: '#f0f0f0', color: '#888',
            fontWeight: '600', fontSize: '0.82rem', cursor: 'pointer',
          }}>
            ✕ Avbryt
          </button>

          {saveStatus === 'error' && (
            <div style={{
              background: '#fff0f0', border: '1px solid #fcc', borderRadius: '8px',
              padding: '5px 8px', fontSize: '0.68rem', color: '#c0392b',
              textAlign: 'center', width: '100%', boxSizing: 'border-box',
            }}>❌ Lagring feilet</div>
          )}
        </div>
      </div>
    </ScrollStackItem>
  );
}