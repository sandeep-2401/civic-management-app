import express from 'express';
import {
  getAllIssues,
  updateIssueStatus,
  deleteIssue,
} from '../controllers/adminController.js';

const router = express.Router();

// Get all issues
router.get('/issues', getAllIssues);

// Update status of a specific issue
router.put('/issues/:id/status', updateIssueStatus);

router.delete('/issues/:id', deleteIssue);

export default router;
