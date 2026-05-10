import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function ensureColumn(table, column, definition) {
  const res = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name=$1 AND column_name=$2`,
    [table, column]
  );
  if (res.rows.length === 0) {
    console.log(`❌ ${table}.${column} MISSING — adding...`);
    await pool.query(`ALTER TABLE "${table}" ADD COLUMN ${column} ${definition}`);
    console.log(`✅ ${table}.${column} added!`);
  } else {
    console.log(`✅ ${table}.${column} exists`);
  }
}

// 1. Create users table FIRST (required for orders FK)
console.log('\n--- USERS TABLE ---');
await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
    name text,
    email text NOT NULL UNIQUE,
    phone text,
    password_hash text,
    created_at timestamp NOT NULL DEFAULT now()
  )
`);
console.log('✅ users table ready');

// 2. products table
console.log('\n--- PRODUCTS TABLE ---');
await ensureColumn('products', 'lead_time_hours', 'integer NOT NULL DEFAULT 24');

// 3. orders table — add columns WITHOUT FK first, then try FK separately
console.log('\n--- ORDERS TABLE ---');

// user_id without FK constraint (safer for existing rows)
const userIdCheck = await pool.query(
  `SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name='user_id'`
);
if (userIdCheck.rows.length === 0) {
  console.log('❌ orders.user_id MISSING — adding...');
  await pool.query(`ALTER TABLE orders ADD COLUMN user_id integer REFERENCES users(id) ON DELETE SET NULL`);
  console.log('✅ orders.user_id added!');
} else {
  console.log('✅ orders.user_id exists');
}

await ensureColumn('orders', 'payment_method', "text NOT NULL DEFAULT 'cod'");
await ensureColumn('orders', 'transaction_id', 'text');
await ensureColumn('orders', 'payment_screenshot', 'text');

// 4. Show final columns for both tables
const prodCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='products' ORDER BY ordinal_position`);
console.log('\nProducts columns:', prodCols.rows.map(r => r.column_name).join(', '));

const orderCols = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name='orders' ORDER BY ordinal_position`);
console.log('Orders columns:', orderCols.rows.map(r => r.column_name).join(', '));

console.log('\n✅ Migration complete!');
await pool.end();
