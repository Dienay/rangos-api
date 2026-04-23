import { Router, Request, Response } from 'express';
import { Multer } from 'multer';
import { establishmentsUpload, productsUpload, usersUpload } from '../config/multer';

const uploadRouter = Router();

const handleFileUpload = (upload: Multer) => (req: Request, res: Response) => {
  upload.single('file')(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: 'File upload failed.', details: (error as Error).message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
    }
    return res.status(200).json({ message: 'File uploaded successfully.', file: req.file });
  });
};

uploadRouter.post('/establishments', handleFileUpload(establishmentsUpload));
uploadRouter.post('/products', handleFileUpload(productsUpload));
uploadRouter.post('/users', handleFileUpload(usersUpload));

export default uploadRouter;
