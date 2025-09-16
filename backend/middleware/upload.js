import cloudinary from '../config/cloudinary.js';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'issue_photos',  // Folder in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Create multer upload
export const upload = multer({ storage });
