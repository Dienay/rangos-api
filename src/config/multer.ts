import multer = require('multer');
import * as path from 'path';
import { Request } from 'express';

const storage = (directory: string): multer.StorageEngine =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', '..', 'uploads', directory));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    }
  });

const fileFilter: multer.Options['fileFilter'] = (req: Request, file, cb) => {
  const mimeType = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg', 'image/svg+xml'];

  cb(null, mimeType.includes(file.mimetype));
};

const limits: multer.Options['limits'] = {
  fileSize: 1024 * 1024 * 8
};

const establishmentsUpload = multer({
  storage: storage('establishments'),
  limits,
  fileFilter
});

const productsUpload = multer({
  storage: storage('products'),
  limits,
  fileFilter
});

const usersUpload = multer({
  storage: storage('users'),
  limits,
  fileFilter
});

export { establishmentsUpload, productsUpload, usersUpload };
