import { Assignment, AssignmentSubmission, StudyMaterial } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createStudyMaterial = asyncHandler(async (req, res) => {
  const material = await StudyMaterial.create({
    ...req.body,
    filePath: req.file.path,
    uploadedById: req.user.id
  });
  res.status(201).json(material);
});

export const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.create({
    ...req.body,
    filePath: req.file?.path,
    createdById: req.user.id
  });
  res.status(201).json(assignment);
});

export const submitAssignment = asyncHandler(async (req, res) => {
  const submission = await AssignmentSubmission.create({
    assignmentId: req.params.assignmentId,
    studentId: req.body.studentId,
    submissionFile: req.file.path,
    submissionDate: new Date(),
    remarks: req.body.remarks
  });
  res.status(201).json(submission);
});
