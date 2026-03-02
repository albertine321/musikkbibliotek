import { useEffect, useState, useRef } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { QRCodeSVG } from 'qrcode.react';
import './ScrollStack.css';
import './Page.css';

const EMPTY_FORM = {
  tittel: '',
  artist_navn: '',
  utgivelsesaar: '',
  bilde_url: '',
  spotify_url: '',
  spotify_code_bilde: '',
};

const inp = {
  width: '100%',
  padding: '6px 10px',
  borderRadius: '8px',
  border: '1.5px solid #e0e0e0',
  fontSize: '0.82rem',
  color: '#2c3e50',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const lbl = {
  fontSize: '0.6rem',
  fontWeight: '700',
  color: '#c0c0c0',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '3px',
  display: 'block',
};

function F({ label, mb = 8, children }) {
  return (
    <div style={{ marginBottom: mb }}>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════
   LEGG TIL ALBUM
══════════════════════════════════════════ */
function AddAlbumCard({ onAlbumAdded }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewImg, setPreviewImg] = useState('');
  const [fileChosen, setFileChosen] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (name === 'bilde_url') { setPreviewImg(value); setFileChosen(false); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const d = ev.target.result;
      setPreviewImg(d);
      setFileChosen(true);
      setForm((p) => ({ ...p, bilde_url: d }));
    };
    reader.readAsDataURL(file);
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setPreviewImg(''); setFileChosen(false);
    setForm((p) => ({ ...p, bilde_url: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!form.tittel.trim() || !form.artist_navn.trim()) {
      setStatus('error'); setErrorMsg('Tittel og artist er påkrevd.'); return;
    }
    setStatus('loading'); setErrorMsg('');
    try {
      const res = await fetch('/musikk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Ukjent feil'); }
      setStatus('success');
      setForm(EMPTY_FORM); setPreviewImg(''); setFileChosen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onAlbumAdded?.();
      setTimeout(() => setStatus(null), 3000);
    } catch (err) { setStatus('error'); setErrorMsg(err.message); }
  };

  const ok = status === 'success', isLoading = status === 'loading';

  return (
    <ScrollStackItem>
      {/* Gradient bakgrunn */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '40px',
        background: 'linear-gradient(135deg, #eef2ff 0%, #f5f0ff 100%)', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px', height: '100%' }}>

        {/* ── VENSTRE: bildeforhåndsvisning + opplasting ── */}
        <div style={{ width: '160px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center' }}>

          {/* Forhåndsvisningsboks */}
          <div style={{
            width: '160px', height: '160px', borderRadius: '12px',
            background: previewImg ? 'transparent' : 'rgba(255,255,255,0.7)',
            border: '2px dashed #d0c8f0', overflow: 'hidden', position: 'relative',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            margin: '0 auto',
          }}>
            {previewImg ? (
              <>
                <img src={previewImg} alt="preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => { setPreviewImg(''); setFileChosen(false); }} />
                <button onClick={clearImage} style={{
                  position: 'absolute', top: 5, right: 5,
                  background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%',
                  width: 22, height: 22, color: '#fff', cursor: 'pointer', fontSize: '0.7rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>✕</button>
              </>
            ) : (
              <>
                <span style={{ fontSize: '1.6rem' }}>🎵</span>
                <span style={{ fontSize: '0.6rem', color: '#c0b8d8', marginTop: '4px', textAlign: 'center' }}>Forhåndsvisning</span>
              </>
            )}
          </div>

          {/* Fil-knapp */}
          <button onClick={() => fileInputRef.current?.click()} style={{
            ...inp, cursor: 'pointer', textAlign: 'center', fontWeight: '600',
            color: fileChosen ? '#27ae60' : '#7c6bbf',
            background: fileChosen ? '#f0fff4' : 'rgba(167,139,250,0.1)',
            border: `1.5px dashed ${fileChosen ? '#27ae60' : '#c0b4f0'}`,
          }}>
            {fileChosen ? '✅ Fil valgt' : '📁 Last opp fil'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

          {/* Eller + URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
            <span style={{ fontSize: '0.65rem', color: '#bbb' }}>eller</span>
            <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
          </div>
          <input
            style={{ ...inp, opacity: fileChosen ? 0.45 : 1 }}
            name="bilde_url"
            value={fileChosen ? '' : form.bilde_url}
            onChange={(e) => {
              if (fileChosen) { setFileChosen(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
              handleChange(e);
            }}
            placeholder={fileChosen ? '(fil er valgt)' : 'Bilde-URL…'}
            disabled={fileChosen}
          />
        </div>

        {/* ── MIDTRE: tekstfelt ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>

          {/* Overskrift */}
          <div style={{ marginBottom: '10px' }}>
            <h2 style={{ margin: 0, color: '#1a1060', fontSize: '1.15rem', fontWeight: '700' }}>Legg til album</h2>
            <p style={{ margin: '1px 0 0', fontSize: '0.7rem', color: '#a8a8c8' }}>Fyll inn og trykk Lagre</p>
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

          <F label="Spotify Code bilde (URL)" mb={0}>
            <input style={inp} name="spotify_code_bilde" value={form.spotify_code_bilde}
              onChange={handleChange} placeholder="https://scannables.scdn.co/…" />
          </F>
        </div>

        {/* ── HØYRE: Spotify URL + QR + Lagre ── */}
        <div style={{
          width: '120px', flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '7px', marginRight: '4px',
        }}>
          <F label="Spotify URL" mb={4}>
            <input style={{ ...inp, fontSize: '0.7rem', padding: '6px 8px' }}
              name="spotify_url" value={form.spotify_url}
              onChange={handleChange} placeholder="https://open.spotify.com/…" />
          </F>

          {/* QR – bare vis hvis URL finnes, ellers placeholder */}
          {form.spotify_url ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <QRCodeSVG value={form.spotify_url} size={90} level="M"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />
              <span style={{ fontSize: '0.6rem', color: '#bbb' }}>Forhåndsvisning</span>
            </div>
          ) : (
            <div style={{
              width: 90, height: 90, borderRadius: '10px',
              background: 'rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '1.4rem', opacity: 0.2 }}>📷</span>
            </div>
          )}

          <button onClick={handleSubmit} disabled={isLoading} style={{
            width: '100%', padding: '9px', borderRadius: '12px', border: 'none',
            background: ok ? '#27ae60' : isLoading ? '#7c6bbf' : '#110954',
            color: '#fff', fontWeight: '700', fontSize: '0.82rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: ok ? '0 3px 10px rgba(39,174,96,0.4)' : '0 3px 10px rgba(17,9,84,0.3)',
          }}>
            {isLoading ? '⏳…' : ok ? '✅ Lagt til!' : '💾 Lagre'}
          </button>

          {status === 'error' && (
            <div style={{
              background: '#fff0f0', border: '1px solid #fcc', borderRadius: '8px',
              padding: '5px 8px', fontSize: '0.68rem', color: '#c0392b',
              textAlign: 'center', width: '100%', boxSizing: 'border-box',
            }}>❌ {errorMsg}</div>
          )}
        </div>
      </div>
    </ScrollStackItem>
  );
}

/* ══════════════════════════════════════════
   ALBUM-KORT
══════════════════════════════════════════ */
function AlbumCard({ album, onDeleted }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const confirmTimer = useRef(null);

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

        {/* Høyre: QR + slett */}
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

/* ══════════════════════════════════════════
   HOVEDSIDE
══════════════════════════════════════════ */
export default function Page() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbums = () => {
    setLoading(true);
    fetch('/musikk')
      .then((r) => { if (!r.ok) throw new Error('Kunne ikke hente musikk'); return r.json(); })
      .then((data) => {
        const sorted = [...data].sort((a, b) => (b.utgivelsesaar || 0) - (a.utgivelsesaar || 0));
        setAlbums(sorted);
        setLoading(false);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchAlbums(); }, []);

  if (loading) return <div className="loading">⏳ Laster...</div>;
  if (error) return <div className="error">❌ Feil: {error}</div>;

  return (
    <div className="musikk-container">
      <ScrollStack useWindowScroll={false}>
        <AddAlbumCard onAlbumAdded={fetchAlbums} />
        {albums.map((album) => (
          <AlbumCard key={album.album_id} album={album} onDeleted={fetchAlbums} />
        ))}
      </ScrollStack>
    </div>
  );
}