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
        const rows = await conn.query('SELECT * FROM album');
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release(); // ✅ Frigjør alltid connections!
    }
}