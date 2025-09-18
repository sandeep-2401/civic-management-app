import client from '../config/db.js';

// Create a new issue
export const createIssue = async (req, res) => {
  const { description, latitude, longitude, user_id } = req.body;
  const image_url = req.file ? req.file.path : null; // Assuming Cloudinary upload

  if (!image_url) return res.status(400).json({ error: 'Image is required' });

  try {
    const result = await client.query(
      'INSERT INTO issue_photos (user_id, description, image_url, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, description, image_url, latitude, longitude]
    );
    
    res.status(201).json(result.rows[0]);
  } 
  catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all issues (admin)
export const getAllIssues = async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM issue_photos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get issues by user
export const getUserIssues = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await client.query('SELECT * FROM issue_photos WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getIssueStats = async (req, res) => {
  try {
    // Total issues
    const totalRes = await client.query('SELECT COUNT(*) FROM issue_photos');
    const total = parseInt(totalRes.rows[0].count);

    // Status counts
    const statusRes = await client.query(`
      SELECT status, COUNT(*) 
      FROM issue_photos 
      GROUP BY status
    `);
    const statusCounts = {
      pending: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0,
    };
    statusRes.rows.forEach(row => {
      statusCounts[row.status] = parseInt(row.count);
    });

    // Daily issues (last 7 days)
    const dailyRes = await client.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM issue_photos
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);
    const dailyReports = dailyRes.rows.map(r => ({ date: r.date, count: parseInt(r.count) }));

    // Top reporters (users with most issues, top 5)
    const topRes = await client.query(`
      SELECT u.username, COUNT(*) AS count
      FROM issue_photos i
      JOIN users u ON i.user_id = u.id
      GROUP BY u.username
      ORDER BY count DESC
      LIMIT 5
    `);
    const topReporters = topRes.rows.map(r => ({ username: r.username, count: parseInt(r.count) }));

    res.json({
      total,
      ...statusCounts,
      dailyReports,
      topReporters
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

