import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Check existing columns
const colRes = await pool.query(
  `SELECT column_name FROM information_schema.columns WHERE table_name='products' ORDER BY ordinal_position`
);
console.log('Products columns:', colRes.rows.map(r => r.column_name).join(', '));

// Add lead_time_hours if missing
const hasLeadTime = colRes.rows.some(r => r.column_name === 'lead_time_hours');
if (!hasLeadTime) {
  console.log('❌ lead_time_hours column MISSING — adding it...');
  await pool.query(`ALTER TABLE products ADD COLUMN lead_time_hours integer NOT NULL DEFAULT 24`);
  console.log('✅ lead_time_hours column added!');
} else {
  console.log('✅ lead_time_hours column exists');
}

await pool.end();
