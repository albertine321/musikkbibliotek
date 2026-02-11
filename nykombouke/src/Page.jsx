import { useEffect, useState } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import './ScrollStack.css';
import './Page.css';

export default function Page() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  fetch('/musikk')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Noe gikk galt');
      }
      return response.json();
    })
    .then((data) => {
      console.log('DATA FRA BACKEND:', data); // <-- LEGG TIL DENNE
      console.log('Er det en array?', Array.isArray(data)); // <-- OG DENNE
      setAlbums(data);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Feil ved henting:', err);
      setError(err.message);
      setLoading(false);
    });
}, []);

  if (loading) return <div>Laster...</div>;/* 
  if (error) return <div>Feil: {error}</div>; */

  return (
    <div className="musikk-container">
      <h1>🎵 Mitt Musikkbibliotek</h1>
      
      {albums.length === 0 ? (
        <p style={{textAlign: 'center', color: '#7f8c8d'}}>
          Ingen album funnet i databasen
        </p>
      ) : (

        <ScrollStack useWindowScroll={true}>  {/* true i stedet for false */}
          {albums.map((album, index) => (
            <ScrollStackItem key={index}>
              <h2>{album.tittel || album.title || 'Ukjent album'}</h2>
              <p>🎤 {album.artist || 'Ukjent artist'}</p>
              <p>📅 {album.år || album.year || 'Ukjent år'}</p>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      )}
    </div>
  );
}
