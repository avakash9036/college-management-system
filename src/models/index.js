import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Role = sequelize.define('Role', {
  name: { type: DataTypes.STRING(40), allowNull: false, unique: true },
  description: DataTypes.STRING
}, { tableName: 'roles' });

export const Permission = sequelize.define('Permission', {
  name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  description: DataTypes.STRING
}, { tableName: 'permissions' });

export const RolePermission = sequelize.define('RolePermission', {}, { tableName: 'role_permissions' });

export const College = sequelize.define('College', {
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING(30), allowNull: false, unique: true },
  address: DataTypes.TEXT,
  email: DataTypes.STRING,
  phoneNumber: DataTypes.STRING(20),
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' }
}, { tableName: 'colleges' });

export const Department = sequelize.define('Department', {
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING(30), allowNull: false },
  description: DataTypes.TEXT,
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' }
}, { tableName: 'departments' });

export const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  employeeId: { type: DataTypes.STRING(40), unique: true },
  studentId: { type: DataTypes.STRING(40), unique: true },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  mobileNumber: DataTypes.STRING(20),
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' },
  refreshToken: DataTypes.TEXT
}, { tableName: 'users' });

export const Staff = sequelize.define('Staff', {
  gender: DataTypes.STRING(20),
  dateOfBirth: DataTypes.DATEONLY,
  qualification: DataTypes.STRING,
  experience: DataTypes.STRING,
  joiningDate: DataTypes.DATEONLY,
  photo: DataTypes.STRING,
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' }
}, { tableName: 'staffs' });

export const Student = sequelize.define('Student', {
  rollNumber: DataTypes.STRING(40),
  gender: DataTypes.STRING(20),
  dateOfBirth: DataTypes.DATEONLY,
  address: DataTypes.TEXT,
  semester: { type: DataTypes.INTEGER, validate: { min: 1, max: 8 } },
  admissionYear: DataTypes.INTEGER,
  parentName: DataTypes.STRING,
  parentMobileNumber: DataTypes.STRING(20),
  photo: DataTypes.STRING,
  status: { type: DataTypes.ENUM('ACTIVE', 'INACTIVE'), defaultValue: 'ACTIVE' }
}, { tableName: 'students' });

export const Subject = sequelize.define('Subject', {
  name: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING(40), allowNull: false },
  semester: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'subjects' });

export const StudentSubject = sequelize.define('StudentSubject', {}, { tableName: 'student_subjects' });

export const Attendance = sequelize.define('Attendance', {
  date: { type: DataTypes.DATEONLY, allowNull: false },
  targetType: { type: DataTypes.ENUM('STUDENT', 'STAFF'), allowNull: false },
  status: { type: DataTypes.ENUM('PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY'), allowNull: false },
  remarks: DataTypes.STRING
}, { tableName: 'attendance' });

export const StudentMark = sequelize.define('StudentMark', {
  semester: { type: DataTypes.INTEGER, allowNull: false },
  internalMarks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  externalMarks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  totalMarks: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
  grade: DataTypes.STRING(5),
  resultStatus: { type: DataTypes.ENUM('PASS', 'FAIL'), defaultValue: 'PASS' }
}, { tableName: 'student_marks' });

export const FeeStructure = sequelize.define('FeeStructure', {
  semester: { type: DataTypes.INTEGER, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  dueDate: DataTypes.DATEONLY
}, { tableName: 'fee_structures' });

export const FeePayment = sequelize.define('FeePayment', {
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentMode: { type: DataTypes.ENUM('CASH', 'CARD', 'UPI', 'BANK_TRANSFER'), allowNull: false },
  transactionNumber: DataTypes.STRING,
  paymentDate: { type: DataTypes.DATEONLY, allowNull: false }
}, { tableName: 'fee_payments' });

export const LeaveRequest = sequelize.define('LeaveRequest', {
  applicantType: { type: DataTypes.ENUM('STUDENT', 'STAFF'), allowNull: false },
  leaveType: { type: DataTypes.STRING, allowNull: false },
  fromDate: { type: DataTypes.DATEONLY, allowNull: false },
  toDate: { type: DataTypes.DATEONLY, allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'), defaultValue: 'PENDING' }
}, { tableName: 'leave_requests' });

export const StudyMaterial = sequelize.define('StudyMaterial', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  semester: DataTypes.INTEGER,
  filePath: { type: DataTypes.STRING, allowNull: false }
}, { tableName: 'study_materials' });

export const Assignment = sequelize.define('Assignment', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  dueDate: DataTypes.DATEONLY,
  semester: DataTypes.INTEGER,
  filePath: DataTypes.STRING
}, { tableName: 'assignments' });

export const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  submissionFile: { type: DataTypes.STRING, allowNull: false },
  submissionDate: { type: DataTypes.DATEONLY, allowNull: false },
  remarks: DataTypes.TEXT
}, { tableName: 'assignment_submissions' });

export const Document = sequelize.define('Document', {
  title: DataTypes.STRING,
  filePath: DataTypes.STRING,
  documentType: DataTypes.STRING
}, { tableName: 'documents' });

export const AuditLog = sequelize.define('AuditLog', {
  action: { type: DataTypes.STRING, allowNull: false },
  entity: DataTypes.STRING,
  entityId: DataTypes.INTEGER,
  details: DataTypes.JSON
}, { tableName: 'audit_logs' });

Role.belongsToMany(Permission, { through: RolePermission, as: 'permissions' });
Permission.belongsToMany(Role, { through: RolePermission, as: 'roles' });

Role.hasMany(User, { foreignKey: { name: 'roleId', allowNull: false }, as: 'users' });
User.belongsTo(Role, { foreignKey: { name: 'roleId', allowNull: false }, as: 'role' });

College.hasMany(Department, { as: 'departments' });
Department.belongsTo(College, { as: 'college' });

College.hasMany(User, { foreignKey: 'collegeId', as: 'users' });
User.belongsTo(College, { foreignKey: 'collegeId', as: 'college' });

College.belongsTo(User, { as: 'principal' });
Department.belongsTo(User, { as: 'hod' });

Department.hasMany(Staff, { as: 'staff' });
Staff.belongsTo(Department, { as: 'department' });
Staff.belongsTo(User, { as: 'user' });
User.hasOne(Staff, { as: 'staffProfile' });

Department.hasMany(Student, { as: 'students' });
Student.belongsTo(Department, { as: 'department' });
Student.belongsTo(User, { as: 'user' });
User.hasOne(Student, { as: 'studentProfile' });

Department.hasMany(Subject, { as: 'subjects' });
Subject.belongsTo(Department, { as: 'department' });
Student.belongsToMany(Subject, { through: StudentSubject, as: 'subjects' });
Subject.belongsToMany(Student, { through: StudentSubject, as: 'students' });

Attendance.belongsTo(User, { as: 'markedBy' });
Attendance.belongsTo(Student, { as: 'student' });
Attendance.belongsTo(Staff, { as: 'staff' });
Attendance.belongsTo(Department, { as: 'department' });

StudentMark.belongsTo(Student, { as: 'student' });
StudentMark.belongsTo(Subject, { as: 'subject' });
StudentMark.belongsTo(User, { as: 'enteredBy' });

FeeStructure.belongsTo(Department, { as: 'department' });
FeePayment.belongsTo(Student, { as: 'student' });
FeePayment.belongsTo(FeeStructure, { as: 'feeStructure' });

LeaveRequest.belongsTo(User, { as: 'applicant' });
LeaveRequest.belongsTo(User, { as: 'reviewedBy' });

StudyMaterial.belongsTo(Department, { as: 'department' });
StudyMaterial.belongsTo(User, { as: 'uploadedBy' });

Assignment.belongsTo(Department, { as: 'department' });
Assignment.belongsTo(User, { as: 'createdBy' });
AssignmentSubmission.belongsTo(Assignment, { as: 'assignment' });
AssignmentSubmission.belongsTo(Student, { as: 'student' });

Document.belongsTo(User, { as: 'owner' });
AuditLog.belongsTo(User, { as: 'user' });

export const models = {
  Role,
  Permission,
  RolePermission,
  College,
  Department,
  User,
  Staff,
  Student,
  Subject,
  StudentSubject,
  Attendance,
  StudentMark,
  FeeStructure,
  FeePayment,
  LeaveRequest,
  StudyMaterial,
  Assignment,
  AssignmentSubmission,
  Document,
  AuditLog
};
