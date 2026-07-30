import express from 'express';
import {
  getColdEmails,
  addColdEmail,
  updateColdEmail,
  deleteColdEmail
} from '../controllers/coldEmailController.js';

const router = express.Router();

router.get('/', getColdEmails);
router.post('/', addColdEmail);
router.patch('/:id', updateColdEmail);
router.delete('/:id', deleteColdEmail);

export default router;
