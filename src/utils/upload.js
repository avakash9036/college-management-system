import path from 'path';
import multer from 'multer';

const allowedExtensions = new Set(['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.zip']);

const storage = multer.diskStorage({
  destination: 'src/uploads',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

export const uploadDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(allowedExtensions.has(ext) ? null : new Error('Unsupported file type'), allowedExtensions.has(ext));
  }
});
