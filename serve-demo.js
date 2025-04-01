const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// Serve static files
app.use(express.static(__dirname));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form-interactive.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});