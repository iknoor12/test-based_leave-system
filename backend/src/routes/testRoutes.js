import express from 'express';
import {
  submitTestResult,
  getTestResults,
  getPendingApprovals,
  approveTestResult,
  rejectTestResult,
} from '../controllers/testController.js';

const router = express.Router();

// Submit test result
router.post('/submit', submitTestResult);

// Get test results for a user
router.get('/user-results', getTestResults);

// Get all pending approvals (admin only)
router.get('/pending-approvals', getPendingApprovals);

// Approve test result (admin only)
router.post('/approve', approveTestResult);

// Reject test result (admin only)
router.post('/reject', rejectTestResult);

export default router;
