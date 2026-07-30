import express from 'express';
import { upload } from '../middlewares/uploadMiddleware.js';
import {
  uploadBulk,
  getApplications,
  addApplication,
  updateApplication,
  deleteApplication
} from '../controllers/applicationController.js';

const router = express.Router();

router.post('/upload-bulk', upload.array('images', 50), uploadBulk);
router.get('/', getApplications);
router.post('/', addApplication);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
