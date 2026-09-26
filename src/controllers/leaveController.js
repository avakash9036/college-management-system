import { LeaveRequest } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const applyLeave = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.create({
    ...req.body,
    applicantId: req.user.id
  });
  res.status(201).json(leave);
});

export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const leave = await LeaveRequest.findByPk(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });
  await leave.update({ status: req.body.status, reviewedById: req.user.id });
  return res.json(leave);
});
