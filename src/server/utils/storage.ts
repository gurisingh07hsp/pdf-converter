import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Configuration for local file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'src/server/uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File validation
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        'application/msword', // doc
        'image/jpeg',
        'image/png'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, Word, and Images are allowed.'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB
    }
});

/**
 * Cleanup Service: Deletes files older than 1 hour
 */
export const cleanupFiles = () => {
    const uploadPath = path.join(process.cwd(), 'src/server/uploads');
    const ONE_HOUR = 60 * 60 * 1000;

    fs.readdir(uploadPath, (err, files) => {
        if (err) return console.error('Cleanup error:', err);

        files.forEach(file => {
            const filePath = path.join(uploadPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;

                if (Date.now() - stats.mtimeMs > ONE_HOUR) {
                    fs.unlink(filePath, err => {
                        if (err) console.error(`Failed to delete ${file}:`, err);
                        else console.log(`🗑️ Auto-deleted expired file: ${file}`);
                    });
                }
            });
        });
    });
};
