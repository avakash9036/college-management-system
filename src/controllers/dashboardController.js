import { ROLES } from '../constants/roles.js';
import {
  Assignment,
  College,
  Department,
  FeePayment,
  FeeStructure,
  LeaveRequest,
  Staff,
  Student,
  StudentMark,
  StudyMaterial,
  User
} from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const dashboard = asyncHandler(async (req, res) => {
  const role = req.user.role.name;
  const cards = [];
  const actions = [];

  if (role === ROLES.SUPER_ADMIN) {
    cards.push(
      ['Total Colleges', await College.count()],
      ['Total Principals', await User.count({ include: [{ association: 'role', where: { name: ROLES.PRINCIPAL } }] })],
      ['Total Staff', await Staff.count()],
      ['Total Students', await Student.count()],
      ['Total Departments', await Department.count()]
    );
    actions.push(
      ['Manage Colleges', '/api/colleges'],
      ['Manage Departments', '/api/departments'],
      ['Add Principal / HOD / Staff', '/api/staff'],
      ['Add Students', '/api/students'],
      ['View Users', '/api/users']
    );
  }

  if (role === ROLES.PRINCIPAL) {
    cards.push(
      ['Total Departments', await Department.count({ where: { collegeId: req.user.collegeId } })],
      ['Total HODs', await User.count({ include: [{ association: 'role', where: { name: ROLES.HOD } }] })],
      ['Total Staff', await Staff.count()],
      ['Total Students', await Student.count()],
      ['Pending Leaves', await LeaveRequest.count({ where: { status: 'PENDING' } })]
    );
    actions.push(
      ['Manage Departments', '/api/departments'],
      ['Add HOD / Staff', '/api/staff'],
      ['Add Students', '/api/students'],
      ['Fees', '/api/fee-structures'],
      ['Leaves', '/api/leave-requests']
    );
  }

  if (role === ROLES.HOD) {
    cards.push(
      ['Department Students', await Student.count()],
      ['Department Staff', await Staff.count()],
      ['Pending Leave Requests', await LeaveRequest.count({ where: { status: 'PENDING' } })],
      ['Marks Entered', await StudentMark.count()]
    );
    actions.push(
      ['Department Staff', '/api/staff'],
      ['Department Students', '/api/students'],
      ['Subjects', '/api/subjects'],
      ['Attendance', '/api/attendance'],
      ['Marks', '/api/marks']
    );
  }

  if (role === ROLES.STAFF) {
    cards.push(
      ['Attendance Entries', 0],
      ['Leave Requests', await LeaveRequest.count({ where: { applicantId: req.user.id } })],
      ['Assignments Created', await Assignment.count({ where: { createdById: req.user.id } })],
      ['Study Materials', await StudyMaterial.count({ where: { uploadedById: req.user.id } })]
    );
    actions.push(
      ['Attendance', '/api/attendance'],
      ['Marks', '/api/marks'],
      ['Study Materials', '/api/study-materials'],
      ['Assignments', '/api/assignments'],
      ['My Leaves', '/api/leave-requests']
    );
  }

  if (role === ROLES.STUDENT) {
    cards.push(
      ['Semester Marks', await StudentMark.count()],
      ['Pending Fees', await FeeStructure.count()],
      ['Payments Made', await FeePayment.count()],
      ['Assignments', await Assignment.count()]
    );
    actions.push(
      ['Assignments', '/api/assignments'],
      ['Study Materials', '/api/study-materials'],
      ['Fees', '/api/fee-payments'],
      ['My Leaves', '/api/leave-requests']
    );
  }

  res.render('dashboard', { title: 'Dashboard', cards, actions, role });
});
