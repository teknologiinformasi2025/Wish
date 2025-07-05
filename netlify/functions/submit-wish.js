// Netlify Function handler (ESM)
import { sql } from '@vercel/postgres';      // works in Netlify Edge Functions too
// or: import postgres from "postgres";  // if you use standard Netlify Functions

// Important: set env var NEON_DB_URL in Netlify dashboard
const db = sql({ connectionString: process.env.NEON_DB_URL });

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, wish } = JSON.parse(event.body || '{}');
    if (!name || !wish) {
      return { statusCode: 400, body: 'Missing name or wish' };
    }

    /* Write to DB */
    await db`INSERT INTO wishes (name, wish) VALUES (${name}, ${wish});`;

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Server error' };
  }
};
