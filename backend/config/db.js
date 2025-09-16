import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
})

client.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error:', err));

export default client;