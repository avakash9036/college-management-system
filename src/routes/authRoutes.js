import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout, me, register, showLogin } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/login', showLogin);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/api/auth/me', requireAuth, me);
router.post(
  '/api/auth/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('firstName').notEmpty(),
    body('lastName').notEmpty(),
    body('roleId').isInt()
  ],
  validate,
  register
);
router.post('/api/auth/login', login);
router.post('/api/auth/logout', requireAuth, logout);

export default router;
