import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files (for downloads)
app.use('/download', express.static(uploadsDir));

// Basic route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'PDF Server is running locally' });
});

// Import and use routes
import pdfRoutes from './routes/pdf.routes';
import { cleanupFiles } from './utils/storage';

app.use('/api/pdf', pdfRoutes);

// Run cleanup every 15 minutes
setInterval(cleanupFiles, 15 * 60 * 1000);

app.listen(PORT, () => {
    console.log(`🚀 PDF Processing Server running on http://localhost:${PORT}`);
    console.log(`📂 Uploads directory: ${uploadsDir}`);
});
