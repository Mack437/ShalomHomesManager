import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5000;

// Serve static files
app.use(express.static(__dirname));

// Route to serve the form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'form-interactive.html'));
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`View the form demo at: http://localhost:${port}/`);
});