import { useEffect, useState, useRef } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { QRCodeSVG } from 'qrcode.react';
import './ScrollStack.css';
import AddAlbumCard from './AddAlbumCard';
import AlbumCard from './AlbumCard';
import './Page.css';

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