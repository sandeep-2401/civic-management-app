import express from 'express';
import { getIssueCounts, getIssuesPerDay, getTopReporters, getAvgResolutionTime } from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/counts', getIssueCounts);
router.get('/perday', getIssuesPerDay);
router.get('/top-reporters', getTopReporters);
router.get('/avg-resolution', getAvgResolutionTime);

export default router;
