import { Router } from 'express';
import { establishmentsUpload } from '@/config/multer';

const uploadRouter = Router();

uploadRouter.post('/establishments', establishmentsUpload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
  }
  return res.status(200).json({ message: 'File uploaded successfully.', file: req.file });
});

export default uploadRouter;
