import express from "express";
import { createServer } from "http";

// Create Express app
const app = express();
const server = createServer(app);

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Simple route to serve HTML content
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ShalomHomes API</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .card { background: #f9f9f9; border-radius: 8px; padding: 20px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <h1>ShalomHomes API</h1>
      <div class="card">
        <h2>API Status: Online</h2>
        <p>The API server is running correctly.</p>
        <p>Visit <a href="/api/health">/api/health</a> to check API status.</p>
      </div>
    </body>
    </html>
  `);
});

// ALWAYS serve the app on port 5000
const port = 5000;
server.listen({
  port,
  host: "0.0.0.0",
}, () => {
  console.log(`Server running on port ${port}`);
});