// netlify/functions/submit-wish.mjs  (ESM)
import { neon } from '@neondatabase/serverless';   // ⬅️ driver Neon

// 🔁 Satu koneksi dipakai ulang antar-invocation
const sql = neon(process.env.NEON_DB_URL);         // pastikan env var ter-set

export async function handler(event) {
  /* Batasi hanya POST */
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { Allow: 'POST' },
      body: 'Method Not Allowed'
    };
  }

  try {
    const { name, wish } = JSON.parse(event.body || '{}');
    if (!name?.trim() || !wish?.trim()) {
      return { statusCode: 400, body: 'Missing name or wish' };
    }

    /* Simpan ke database – interpolasi aman dari SQL-injection */
    await sql`INSERT INTO wishes (name, wish) VALUES (${name}, ${wish});`;

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
}
