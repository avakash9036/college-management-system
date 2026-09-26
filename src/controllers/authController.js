import { Op } from 'sequelize';
import { Role, User } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { createAccessToken, createRefreshToken } from '../utils/tokens.js';

function sendTokens(res, user) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return { accessToken, refreshToken };
}

export const showLogin = (req, res) => {
  res.render('login', { title: 'Login', error: null });
};

export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, roleId, employeeId, studentId, mobileNumber, collegeId } = req.body;
  const user = await User.create({
    email,
    firstName,
    lastName,
    employeeId,
    studentId,
    mobileNumber,
    collegeId,
    roleId,
    passwordHash: await hashPassword(password)
  });
  res.status(201).json({ id: user.id, email: user.email });
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { employeeId: identifier }, { studentId: identifier }]
    },
    include: [{ model: Role, as: 'role' }]
  });

  if (!user || !(await comparePassword(password, user.passwordHash))) {
    if (req.accepts('html') && !req.originalUrl.startsWith('/api')) {
      return res.status(401).render('login', { title: 'Login', error: 'Invalid login details' });
    }
    return res.status(401).json({ message: 'Invalid login details' });
  }

  const tokens = sendTokens(res, user);
  await user.update({ refreshToken: tokens.refreshToken });

  if (req.accepts('html') && !req.originalUrl.startsWith('/api')) return res.redirect('/dashboard');
  return res.json({ user: { id: user.id, email: user.email, role: user.role.name }, ...tokens });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) await req.user.update({ refreshToken: null });
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  if (req.accepts('html') && !req.originalUrl.startsWith('/api')) return res.redirect('/login');
  return res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  res.json(req.user);
});
