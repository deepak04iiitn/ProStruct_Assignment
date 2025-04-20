import { Router } from 'express';
import { getContacts } from '../controllers/hubspotController.js';

const router = Router();

router.get('/contacts', getContacts);

export default router;