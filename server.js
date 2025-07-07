// server.js

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to receive endorsement submissions
app.post('/api/endorse', (req, res) => {
  const newEndorsement = req.body;

  const endorsementsPath = path.join(__dirname, 'api', 'endorsements', 'endorsements.json');

  // Read existing endorsements
  fs.readFile(endorsementsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read endorsements:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    let endorsements = [];
    try {
      endorsements = JSON.parse(data);
    } catch (parseErr) {
      console.error('Failed to parse endorsements:', parseErr);
    }

    // Add the new one
    endorsements.push(newEndorsement);

    // Write back to file
    fs.writeFile(endorsementsPath, JSON.stringify(endorsements, null, 2), (writeErr) => {
      if (writeErr) {
        console.error('Failed to save endorsement:', writeErr);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      console.log('Endorsement added:', newEndorsement);
      res.status(200).json({ success: true });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🌐 Endorsement hub running on http://localhost:${PORT}`);
});
