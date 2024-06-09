import multer from 'multer';
import path from 'path';

const storage = (directory: string) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '..', '..', 'uploads', directory));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    }
  });

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const mimeType = ['image/png', 'image/jpeg', 'image/gif', 'image/jpg'];

  if (!mimeType.includes(file.mimetype)) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const limits = {
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
