const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const con = require('./DB_Conn');

const app = express();
const publicPath = path.join(__dirname, 'public');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(publicPath));

// Serve home page on root URL
app.get('/home', (req, res) => {
  res.sendFile(path.join(publicPath, 'home.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(publicPath, 'signup.html'));
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(publicPath, 'loginpage.html'));
});

// Registration route
app.post('/RegistrationValidation', (req, res) => {
  const { email, password, cpass } = req.body;

  if (!email || !password || !cpass) {
    return res.status(400).send('Please fill all fields');
  }
  if (password !== cpass) {
    return res.status(400).send('Passwords do not match');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Hashing error:', err);
      return res.status(500).send('Encryption error');
    }

    const sql = 'INSERT INTO user (email, password) VALUES (?, ?)';
    con.query(sql, [email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).send('Email already registered');
        }
        console.error('Database error:', err);
        return res.status(500).send('Database error');
      }
      res.redirect('/login');
    });
  });
});

// Login route
app.post('/LoginValidation', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Please fill all fields');
  }

  const sql = 'SELECT * FROM user WHERE email = ?';
  con.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid email or password');
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Encryption error:', err);
        return res.status(500).send('Encryption error');
      }

      if (isMatch) {
        // Redirect to /home1 route that serves home1.html
        res.redirect('/home1.html');
      } else {
        res.status(401).send('Invalid email or password');
      }
    });
  });
});

// Catch-all 404
app.use((req, res) => {
  res.status(404).send('Page not found');
});

const PORT = 6700;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
