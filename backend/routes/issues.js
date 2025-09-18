import express from 'express';
import { createIssue, getUserIssues, getAllIssues, getIssueStats} from '../controllers/issueController.js';
import { upload } from '../middleware/upload.js'; // Cloudinary/multer middleware

const router = express.Router();

// Create a new issue (with image upload)
router.post('/report', upload.single('image'), createIssue);

// Get all issues (admin)
router.get('/', getAllIssues);

// Get issues by a specific user
router.get('/user/:userId', getUserIssues);

router.get('/stats', getIssueStats);

export default router;
