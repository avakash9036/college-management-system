import { verifyAccessToken } from '../utils/tokens.js';
import { ROLES } from '../constants/roles.js';
import { User, Role } from '../models/index.js';

function readToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return req.cookies?.accessToken;
}

export async function optionalUser(req, res, next) {
  try {
    const token = readToken(req);
    if (!token) return next();

    const payload = verifyAccessToken(token);
    req.user = await User.findByPk(payload.id, {
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['passwordHash', 'refreshToken'] }
    });
    res.locals.currentUser = req.user;
    return next();
  } catch {
    return next();
  }
}

export async function requireAuth(req, res, next) {
  try {
    const token = readToken(req);
    if (!token) {
      if (req.accepts('html') && !req.originalUrl.startsWith('/api')) return res.redirect('/login');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const payload = verifyAccessToken(token);
    const user = await User.findByPk(payload.id, {
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['passwordHash'] }
    });

    if (!user || user.status !== 'ACTIVE') return res.status(401).json({ message: 'Invalid user' });

    req.user = user;
    res.locals.currentUser = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export const authorize = (...roles) => (req, res, next) => {
  const roleName = req.user?.role?.name;
  if (roleName === ROLES.SUPER_ADMIN) return next();
  if (!roles.includes(roleName)) return res.status(403).json({ message: 'Access denied' });
  return next();
};
