import express from 'express';

const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send('<h1>Simple Test Server</h1><p>This is a basic Express server test.</p>');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Simple test server running on port ${port}`);
});