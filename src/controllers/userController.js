import { Role, Staff, Student, User } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashPassword } from '../utils/password.js';

function wantsHtml(req) {
  return req.accepts(['html', 'json']) === 'html';
}

function normalizeId(value) {
  return value === '' || value === undefined ? null : value;
}

async function resolveRole(roleId, roleName) {
  if (roleId) return roleId;
  const role = await Role.findOne({ where: { name: roleName } });
  if (!role) throw new Error(`${roleName} role not found`);
  return role.id;
}

export const createStaff = asyncHandler(async (req, res) => {
  const {
    password = 'Password@123',
    roleId,
    roleName = 'STAFF',
    departmentId,
    email,
    employeeId,
    firstName,
    lastName,
    mobileNumber,
    collegeId,
    gender,
    dateOfBirth,
    qualification,
    experience,
    joiningDate
  } = req.body;
  const user = await User.create({
    email,
    employeeId: normalizeId(employeeId),
    firstName,
    lastName,
    mobileNumber,
    collegeId: normalizeId(collegeId),
    roleId: await resolveRole(roleId, roleName),
    passwordHash: await hashPassword(password)
  });
  const staff = await Staff.create({
    gender,
    dateOfBirth: normalizeId(dateOfBirth),
    qualification,
    experience,
    joiningDate: normalizeId(joiningDate),
    userId: user.id,
    departmentId: normalizeId(departmentId)
  });
  if (wantsHtml(req)) return res.redirect('/api/staff');
  res.status(201).json({ user, staff });
});

export const createStudent = asyncHandler(async (req, res) => {
  const {
    password = 'Password@123',
    roleId,
    departmentId,
    email,
    studentId,
    firstName,
    lastName,
    mobileNumber,
    collegeId,
    rollNumber,
    gender,
    dateOfBirth,
    address,
    semester,
    admissionYear,
    parentName,
    parentMobileNumber
  } = req.body;
  const user = await User.create({
    email,
    studentId: normalizeId(studentId),
    firstName,
    lastName,
    mobileNumber,
    collegeId: normalizeId(collegeId),
    roleId: await resolveRole(roleId, 'STUDENT'),
    passwordHash: await hashPassword(password)
  });
  const student = await Student.create({
    rollNumber,
    gender,
    dateOfBirth: normalizeId(dateOfBirth),
    address,
    semester: normalizeId(semester),
    admissionYear: normalizeId(admissionYear),
    parentName,
    parentMobileNumber,
    userId: user.id,
    departmentId: normalizeId(departmentId)
  });
  if (wantsHtml(req)) return res.redirect('/api/students');
  res.status(201).json({ user, student });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({
    include: [{ model: Role, as: 'role' }],
    attributes: { exclude: ['passwordHash', 'refreshToken'] },
    order: [['createdAt', 'DESC']]
  });
  res.json(users);
});
