import { Router } from 'express';
import { ROLES } from '../constants/roles.js';
import { crudController } from '../controllers/crudController.js';
import { createAssignment, createStudyMaterial, submitAssignment } from '../controllers/fileController.js';
import { applyLeave, updateLeaveStatus } from '../controllers/leaveController.js';
import { createStaff, createStudent, listUsers } from '../controllers/userController.js';
import { authorize, requireAuth } from '../middlewares/auth.js';
import { uploadDocument } from '../utils/upload.js';
import {
  Assignment,
  AssignmentSubmission,
  Attendance,
  College,
  Department,
  FeePayment,
  FeeStructure,
  LeaveRequest,
  Role,
  Staff,
  Student,
  StudentMark,
  StudyMaterial,
  Subject,
  User
} from '../models/index.js';

const router = Router();

router.use(requireAuth);

function resource(path, controller, roles) {
  router.get(path, authorize(...roles), controller.list);
  router.get(`${path}/:id`, authorize(...roles), controller.get);
  router.post(path, authorize(...roles), controller.create);
  router.put(`${path}/:id`, authorize(...roles), controller.update);
  router.delete(`${path}/:id`, authorize(...roles), controller.remove);
}

resource('/colleges', crudController(College), [ROLES.SUPER_ADMIN]);
resource('/departments', crudController(Department), [ROLES.PRINCIPAL, ROLES.HOD]);
resource('/subjects', crudController(Subject), [ROLES.PRINCIPAL, ROLES.HOD, ROLES.STAFF]);
resource('/attendance', crudController(Attendance), [ROLES.PRINCIPAL, ROLES.HOD, ROLES.STAFF]);
resource('/marks', crudController(StudentMark), [ROLES.PRINCIPAL, ROLES.HOD, ROLES.STAFF]);
resource('/fee-structures', crudController(FeeStructure), [ROLES.PRINCIPAL]);
resource('/fee-payments', crudController(FeePayment), [ROLES.PRINCIPAL, ROLES.STUDENT]);
resource('/leave-requests', crudController(LeaveRequest), [ROLES.PRINCIPAL, ROLES.HOD, ROLES.STAFF, ROLES.STUDENT]);
resource('/study-materials', crudController(StudyMaterial), [ROLES.PRINCIPAL, ROLES.HOD, ROLES.STAFF, ROLES.STUDENT]);
resource('/assignments', crudController(Assignment), [ROLES.PRINCIPAL, ROLES.HOD, ROLES.STAFF, ROLES.STUDENT]);
resource('/assignment-submissions', crudController(AssignmentSubmission), [ROLES.PRINCIPAL, ROLES.HOD, ROLES.STAFF, ROLES.STUDENT]);

router.get('/users', authorize(ROLES.SUPER_ADMIN, ROLES.PRINCIPAL), listUsers);
router.post('/staff', authorize(ROLES.PRINCIPAL, ROLES.HOD), createStaff);
router.post('/students', authorize(ROLES.PRINCIPAL, ROLES.HOD), createStudent);
resource(
  '/staff',
  crudController(Staff, {
    include: [{ model: User, as: 'user', include: [{ model: Role, as: 'role' }] }],
    formFields: [
      { name: 'firstName', label: 'First Name', required: true, values: [], type: 'STRING' },
      { name: 'lastName', label: 'Last Name', required: true, values: [], type: 'STRING' },
      { name: 'email', label: 'Email', required: true, values: [], type: 'STRING' },
      { name: 'password', label: 'Password', required: false, values: [], type: 'STRING' },
      { name: 'employeeId', label: 'Employee ID', required: false, values: [], type: 'STRING' },
      {
        name: 'roleName',
        label: 'Role',
        required: true,
        values: [
          { value: 'PRINCIPAL', label: 'Principal' },
          { value: 'HOD', label: 'HOD' },
          { value: 'STAFF', label: 'Staff' }
        ],
        type: 'STRING'
      },
      { name: 'mobileNumber', label: 'Mobile Number', required: false, values: [], type: 'STRING' },
      { name: 'collegeId', label: 'College ID', required: false, values: [], type: 'INTEGER' },
      { name: 'departmentId', label: 'Department ID', required: false, values: [], type: 'INTEGER' },
      { name: 'gender', label: 'Gender', required: false, values: [], type: 'STRING' },
      { name: 'qualification', label: 'Qualification', required: false, values: [], type: 'STRING' },
      { name: 'experience', label: 'Experience', required: false, values: [], type: 'STRING' },
      { name: 'joiningDate', label: 'Joining Date', required: false, values: [], type: 'DATEONLY' }
    ],
    displayFields: [
      { name: 'user.firstName', label: 'First Name' },
      { name: 'user.lastName', label: 'Last Name' },
      { name: 'user.email', label: 'Email' },
      { name: 'user.role.name', label: 'Role' },
      { name: 'qualification', label: 'Qualification' },
      { name: 'experience', label: 'Experience' }
    ]
  }),
  [ROLES.PRINCIPAL, ROLES.HOD]
);
resource(
  '/students',
  crudController(Student, {
    include: [{ model: User, as: 'user' }],
    formFields: [
      { name: 'roleName', label: 'Role', required: true, values: [], type: 'hidden', value: 'STUDENT' },
      { name: 'firstName', label: 'First Name', required: true, values: [], type: 'STRING' },
      { name: 'lastName', label: 'Last Name', required: true, values: [], type: 'STRING' },
      { name: 'email', label: 'Email', required: true, values: [], type: 'STRING' },
      { name: 'password', label: 'Password', required: false, values: [], type: 'STRING' },
      { name: 'studentId', label: 'Student ID', required: false, values: [], type: 'STRING' },
      { name: 'rollNumber', label: 'Roll Number', required: false, values: [], type: 'STRING' },
      { name: 'mobileNumber', label: 'Mobile Number', required: false, values: [], type: 'STRING' },
      { name: 'collegeId', label: 'College ID', required: false, values: [], type: 'INTEGER' },
      { name: 'departmentId', label: 'Department ID', required: false, values: [], type: 'INTEGER' },
      { name: 'semester', label: 'Semester', required: false, values: [], type: 'INTEGER' },
      { name: 'admissionYear', label: 'Admission Year', required: false, values: [], type: 'INTEGER' },
      { name: 'parentName', label: 'Parent Name', required: false, values: [], type: 'STRING' },
      { name: 'parentMobileNumber', label: 'Parent Mobile Number', required: false, values: [], type: 'STRING' },
      { name: 'address', label: 'Address', required: false, values: [], type: 'TEXT' }
    ],
    displayFields: [
      { name: 'user.firstName', label: 'First Name' },
      { name: 'user.lastName', label: 'Last Name' },
      { name: 'user.email', label: 'Email' },
      { name: 'rollNumber', label: 'Roll Number' },
      { name: 'semester', label: 'Semester' },
      { name: 'parentName', label: 'Parent Name' }
    ]
  }),
  [ROLES.PRINCIPAL, ROLES.HOD]
);

router.post('/leaves/apply', authorize(ROLES.STAFF, ROLES.STUDENT), applyLeave);
router.patch('/leaves/:id/status', authorize(ROLES.PRINCIPAL, ROLES.HOD), updateLeaveStatus);

router.post('/materials/upload', authorize(ROLES.STAFF), uploadDocument.single('file'), createStudyMaterial);
router.post('/assignments/upload', authorize(ROLES.STAFF), uploadDocument.single('file'), createAssignment);
router.post('/assignments/:assignmentId/submit', authorize(ROLES.STUDENT), uploadDocument.single('file'), submitAssignment);

export default router;
