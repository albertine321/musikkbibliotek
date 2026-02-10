import { useEffect, useState } from 'react';

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
        setAlbums(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Feil ved henting:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Laster...</div>;
  if (error) return <div>Feil: {error}</div>;

  return (
    <div>
      <h1>Musikkbibliotek</h1>
      <ul>
        {albums.map((album, index) => (
          <li key={index}>
            {JSON.stringify(album)}
          </li>
        ))}
      </ul>
    </div>
  );
}
