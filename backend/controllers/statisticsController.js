import client from '../config/db.js';

// Get issue counts
export const getIssueCounts = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT
        COUNT(*) FILTER (WHERE status='pending') AS pending,
        COUNT(*) FILTER (WHERE status='resolved') AS resolved,
        COUNT(*) FILTER (WHERE status='in_progress') AS in_progress,
        COUNT(*) AS total
      FROM issue_photos
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get issues per day (for line graph)
export const getIssuesPerDay = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT
        TO_CHAR(created_at, 'YYYY-MM-DD') AS date,
        COUNT(*) AS count
      FROM issue_photos
      GROUP BY date
      ORDER BY date
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get top reporters
export const getTopReporters = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT u.username, COUNT(*) AS issues_reported
      FROM issue_photos i
      JOIN users u ON i.user_id = u.id
      GROUP BY u.username
      ORDER BY issues_reported DESC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get average resolution time (in hours)
export const getAvgResolutionTime = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) AS avg_hours
      FROM issue_photos
      WHERE resolved_at IS NOT NULL
    `);
    res.json({ avg_hours: result.rows[0].avg_hours || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
