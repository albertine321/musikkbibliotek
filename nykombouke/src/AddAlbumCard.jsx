import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ScrollStackItem } from './ScrollStack';
import { inp /*lbl*/, F, EMPTY_FORM } from './formStyles.js';
import './App.css';

const genererSpotifyCode = (spotifyUrl) => {
  try {
    // Trekk ut ID fra f.eks. https://open.spotify.com/album/4LH4d3cOWNNsVw41Gqt2kv
    const deler = spotifyUrl.split('/');
    const type = deler[deler.length - 2]; // 'album', 'track', osv.
    const id = deler[deler.length - 1].split('?')[0]; // fjern ev. ?si=...
    return `https://scannables.scdn.co/uri/plain/png/ffffff/black/640/spotify:${type}:${id}`;
  } catch {
    return '';
  }
};

export default function AddAlbumCard({ onAlbumAdded }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [previewImg, setPreviewImg] = useState('');
  const [fileChosen, setFileChosen] = useState(false);
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
            width: '120px', height: '120px', borderRadius: '12px',
            background: previewImg ? 'transparent' : 'rgba(255,255,255,0.7)',
            border: '2px dashed #d0c8f0', overflow: 'hidden', position: 'relative',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            margin: '20px auto',
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
                <span style={{ fontSize: '0.8rem', color: '#c0b8d8', marginTop: '4px', textAlign: 'center' }}>Forhåndsvisning</span>

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
          
          <label for="last_opp_bilde" style={{ fontSize: '0rem', color: '#bbb', marginTop: '2px' }}>
            Last opp bilde
            <input id="last_opp_bilde" ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>

          {/* Eller + URL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ flex: 1, height: '1px', background: '#1a1060' }} />
            <span style={{ fontSize: '0.7rem', color: '#1a1060' }}>eller</span>
            <div style={{ flex: 1, height: '1px', background: '#1a1060' }} />
          </div>
          
          <label for="bilde_url" style={{ fontSize: '0rem', fontWeight: '700', color: '#110955', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px', display: 'block', }}>
            Bilde-URL
            <input style={{ ...inp, opacity: fileChosen ? 0.45 : 1 }} name="bilde_url" id="bilde_url" value={fileChosen ? '' : form.bilde_url} onChange={(e) => {if (fileChosen) { setFileChosen(false); if (fileInputRef.current) fileInputRef.current.value = ''; } handleChange(e); }} placeholder={fileChosen ? '(fil er valgt)' : 'Bilde-URL…'} disabled={fileChosen}/>
          </label>
        </div>

        {/* ── MIDTRE: tekstfelt ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>

          {/* Overskrift */}
          <div style={{ marginBottom: '10px' }}>
            <h2 style={{ margin: 0, color: '#1a1060', fontSize: '1.15rem', fontWeight: '700' }}>Legg til album</h2>
            <p style={{ margin: '1px 0 0', fontSize: '0.7rem', color: '#1a1060' }}>Fyll inn og trykk Lagre</p>
          </div>
            

            <label for="tittel" style={{ fontSize: '0.6rem', fontWeight: '700', color: '#110955', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px', display: 'block', }}>
              Albumtittel
              <input style={inp} name="tittel" id="tittel" value={form.tittel} onChange={handleChange} placeholder="f.eks. Abbey Road" />
            </label>

            <label for="artist_navn" style={{ fontSize: '0.6rem', fontWeight: '700', color: '#110955', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px', display: 'block', }}>
              🎤 Artist
              <input style={inp} name="artist_navn" id="artist_navn" value={form.artist_navn} onChange={handleChange} placeholder="f.eks. The Beatles" />
            </label>

            <label for="utgivelsesaar" style={{ fontSize: '0.6rem', fontWeight: '700', color: '#110955', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px', display: 'block', }}>
              📅 Utgivelsesår
              <input style={inp} name="utgivelsesaar" id="utgivelsesaar" value={form.utgivelsesaar} onChange={handleChange} placeholder="f.eks. 1969" type="number" />
            </label>


            <label for="spotify_code_bilde" style={{ fontSize: '0.6rem', fontWeight: '700', color: '#110955', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px', display: 'block', }}>
              Spotify kode (valgfritt)
              <input style={inp} name="spotify_code_bilde" id="spotify_code_bilde" value={form.spotify_code_bilde} onChange={handleChange} placeholder="https://scannables.scdn.co/…" />
            </label>

        </div>

        {/* ── HØYRE: Spotify URL + QR + Lagre ── */}
        <div style={{
          width: '120px', flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '7px', marginRight: '4px', marginTop: '30px', 
        }}>

          <label for='spotify_url' style={{ fontSize: '0.6rem', fontWeight: '700', color: '#110955', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '3px', display: 'block', }} >
            Spotify URL
            <input style={{ ...inp, fontSize: '0.7rem', padding: '8px 8px', }} name="spotify_url" id="spotify_url" value={form.spotify_url} onChange={handleChange} placeholder="https://open.spotify.com/…" />
          </label>


          {/* QR – bare vis hvis URL finnes, ellers placeholder */}
          {form.spotify_url ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <QRCodeSVG value={form.spotify_url} size={90} level="M"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.12))' }} />
              <p style={{ fontSize: '0.8rem', color: '#110954' }}>Forhåndsvisning</p>
            </div>
          ) : (
            <div style={{
            width: 120, height: 120, borderRadius: '10px',
            background: 'rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,  // ← denne
            }}>
            <span style={{ fontSize: '1.4rem', opacity: 0.2 }}>📷</span>
            </div>
          )}

          <button onClick={handleSubmit} disabled={isLoading} style={{
            width: '100%', padding: '9px', borderRadius: '12px', border: 'none', marginTop: '5px',
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