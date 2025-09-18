import client from '../config/db.js'; // Postgres client

// Get all reported issues
export const getAllIssues = async (req, res) => {
  try {
    const result = await client.query(
      `SELECT id, user_id, description, image_url, latitude, longitude, status, created_at, resolved_at
       FROM issue_photos
       ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update issue status
export const updateIssueStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'in_progress', 'resolved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const result = await client.query(
      `UPDATE issue_photos
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteIssue = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      'DELETE FROM issue_photos WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.status(200).json({ message: 'Issue deleted successfully', issue: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

