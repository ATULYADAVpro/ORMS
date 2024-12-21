import { config } from 'dotenv';
config();

export const { PORT, DEBUG_MODE, DB_URL,JWT_SECRECT } = process.env;