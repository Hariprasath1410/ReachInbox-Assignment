import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';
import { ensureIndex } from './esClient';

dotenv.config();
const app = express();
app.use(express.json());
// Enable CORS so the frontend (served on another port) can call the API
app.use(cors());
app.use('/api', router);

// Use PORT from env (backend/.env sets 3001). Default to 3001 to match frontend API URL.
const PORT = parseInt(process.env.PORT || '3001', 10);

(async () => {
  await ensureIndex();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
