import { useEffect, useState } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { QRCodeSVG } from 'qrcode.react';
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
          throw new Error('Kunne ikke hente musikk');
        }
        return response.json();
      })
      .then((data) => {
        setAlbums(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Feil ved henting:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">⏳ Laster...</div>;
  if (error) return <div className="error">❌ Feil: {error}</div>;

  return (
    <div className="musikk-container">
      {albums.length === 0 ? (
        <p style={{textAlign: 'center', color: '#7f8c8d'}}>
          Ingen album funnet i databasen
        </p>
      ) : (
        <ScrollStack useWindowScroll={false}>
          {albums.map((album, index) => (
            <ScrollStackItem key={index}>
              <div style={{ 
                display: 'flex', 
                gap: '20px',
                alignItems: 'flex-start'
              }}>
                {/* Album cover venstre */}
                {album.bilde_url && (
                  <img 
                    src={album.bilde_url} 
                    alt={album.tittel}
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '12px',
                      marginTop: '10px',
                      objectFit: 'cover',
                      filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))',
                      flexShrink: 0
                    }}
                  />
                )}
                
                {/* Album info og Spotify Code midten */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <h2 style={{ marginBottom: '5px' }}>{album.tittel || 'Ukjent album'}</h2>
                    <p style={{ margin: '4px 0' }}>🎤 {album.artist_navn || 'Ukjent artist'}</p>
                    <p style={{ margin: '4px 0' }}>📅 {album.utgivelsesaar || 'Ukjent år'}</p>
                  </div>
                  
                  {album.spotify_code_bilde && (
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '8px',
                      paddingBottom: '20px'
                    }}>
                      <img 
                        src={album.spotify_code_bilde}
                        alt="Spotify Code"
                        style={{ 
                          width: '200px',
                          height: 'auto',
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                        }}
                      />
                      <p style={{ 
                        fontSize: '0.8rem', 
                        margin: 0,
                        color: '#666',
                        fontWeight: '500'
                      }}>Skann i Spotify</p>
                    </div>
                  )}
                </div>

                {/* QR-kode høyre */}
                {album.spotify_url && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0,
                    marginTop: '50px',  // Flytter QR-koden nedover
                    marginRight: '20px'
                  }}>
                    <QRCodeSVG 
                      value={album.spotify_url}
                      size={120}
                      level="M"
                      style={{
                        filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))',
                      }}
                    />
                    <p style={{ 
                      fontSize: '0.75rem', 
                      margin: 0,
                      color: '#666',
                      fontWeight: '500'
                    }}>Skann QR fra kamera</p>
                  </div>
                )}
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      )}
    </div>
  );
}