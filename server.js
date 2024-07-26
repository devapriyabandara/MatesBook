const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE contacts (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT)");
});

// API routes
app.get('/api/contacts', (req, res) => {
  db.all("SELECT * FROM contacts", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success", "data": rows });
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, phone } = req.body;
  db.run("INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)", [name, email, phone], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success", "data": this.lastID });
  });
});

app.put('/api/contact/:id', (req, res) => {
  const { name, email, phone } = req.body;
  db.run(
    "UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?",
    [name, email, phone, req.params.id],
    function(err) {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({ "message": "success", "data": this.changes });
    }
  );
});

app.delete('/api/contact/:id', (req, res) => {
  db.run("DELETE FROM contacts WHERE id = ?", req.params.id, function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "success", "data": this.changes });
  });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
