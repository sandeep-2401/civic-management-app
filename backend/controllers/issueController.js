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
