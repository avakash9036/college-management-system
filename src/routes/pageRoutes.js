import { Router } from 'express';
import { dashboard } from '../controllers/dashboardController.js';
import { optionalUser, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', optionalUser, (req, res) => {
  if (req.user) return res.redirect('/dashboard');
  return res.redirect('/login');
});

router.get('/dashboard', requireAuth, dashboard);

export default router;
