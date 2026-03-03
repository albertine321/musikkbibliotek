import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ScrollStackItem } from './ScrollStack';

export default function AlbumCard({ album, onDeleted }) {
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