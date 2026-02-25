import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'databasebruker',
  password: '1234',
  connectionLimit: 5,
  database: 'musikkbib'
});

export async function get_Album() {
    let conn;
    try {
        conn = await pool.getConnection();
        // JOIN med artist-tabellen for å få artistnavn
        const rows = await conn.query(`
            SELECT 
                album.album_id,
                album.tittel,
                album.utgivelsesaar,
                album.spotify_url,
                album.bilde_url,
                album.spotify_code_bilde,
                artist.navn AS artist_navn
            FROM album
            JOIN artist ON album.artist_id = artist.artist_id
            ORDER BY album.album_id
        `);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}