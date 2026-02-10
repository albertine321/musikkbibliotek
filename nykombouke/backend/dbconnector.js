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

    const rows = await conn.query("SELECT * FROM album");
    console.log(rows); //[ {val: 1}, meta: ... ]

    return rows;

  } catch (err) {
    throw err;
  }
}