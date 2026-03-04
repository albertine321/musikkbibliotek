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

export async function add_Album({ tittel, artist_navn, utgivelsesaar, bilde_url, spotify_url, spotify_code_bilde }) {
    let conn;
    try {
        conn = await pool.getConnection();

        // Sjekk om artisten finnes, ellers opprett den
        let artistRows = await conn.query(
            `SELECT artist_id FROM artist WHERE navn = ?`,
            [artist_navn]
        );

        let artist_id;
        if (artistRows.length > 0) {
            artist_id = artistRows[0].artist_id;
        } else {
            const result = await conn.query(
                `INSERT INTO artist (navn) VALUES (?)`,
                [artist_navn]
            );
            artist_id = Number(result.insertId);
        }

        const result = await conn.query(
            `INSERT INTO album (tittel, artist_id, utgivelsesaar, bilde_url, spotify_url, spotify_code_bilde)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [tittel, artist_id, utgivelsesaar || null, bilde_url || null, spotify_url || null, spotify_code_bilde || null]
        );

        return { success: true, album_id: Number(result.insertId) };
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}

export async function update_Album(album_id, { tittel, artist_navn, utgivelsesaar, bilde_url, spotify_url, spotify_code_bilde }) {
  let conn;
  try {
    conn = await pool.getConnection();

    let artistRows = await conn.query(`SELECT artist_id FROM artist WHERE navn = ?`, [artist_navn]);
    let artist_id;
    if (artistRows.length > 0) {
      artist_id = artistRows[0].artist_id;
    } else {
      const r = await conn.query(`INSERT INTO artist (navn) VALUES (?)`, [artist_navn]);
      artist_id = Number(r.insertId);
    }

    await conn.query(
      `UPDATE album SET tittel=?, artist_id=?, utgivelsesaar=?, bilde_url=?, spotify_url=?, spotify_code_bilde=? WHERE album_id=?`,
      [tittel, artist_id, utgivelsesaar || null, bilde_url || null, spotify_url || null, spotify_code_bilde || null, album_id]
    );
    return { success: true };
  } finally {
    if (conn) conn.release();
  }
}

export async function delete_Album(album_id) {
    let conn;
    try {
        conn = await pool.getConnection();

        // Finn artist_id før vi sletter albumet
        const albumRows = await conn.query(
            `SELECT artist_id FROM album WHERE album_id = ?`,
            [album_id]
        );

        if (albumRows.length === 0) {
            throw new Error(`Album med id ${album_id} finnes ikke`);
        }

        const artist_id = albumRows[0].artist_id;

        // Slett albumet
        await conn.query(`DELETE FROM album WHERE album_id = ?`, [album_id]);

        // Rydd opp artist hvis den ikke har flere album
        const remaining = await conn.query(
            `SELECT COUNT(*) AS count FROM album WHERE artist_id = ?`,
            [artist_id]
        );
        if (Number(remaining[0].count) === 0) {
            await conn.query(`DELETE FROM artist WHERE artist_id = ?`, [artist_id]);
        }

        return { success: true };
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }
}