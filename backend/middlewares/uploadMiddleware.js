import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    cb(allowed.includes(file.mimetype) ? null : new Error('Only PNG/JPG/JPEG/WEBP images allowed'), allowed.includes(file.mimetype));
  },
});
