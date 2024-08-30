const express = require('express');
const path = require('path');

const router = express.Router();

// Serve login page
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve signup page
router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handle login form submission
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Perform your authentication logic here
    if (username === 'admin' && password === 'password') {
        res.redirect('/index.html');
    } else {
        res.status(401).send('Invalid username or password.');
    }
});

// Handle signup form submission
router.post('/signup', (req, res) => {
    // Add your signup logic here
    res.redirect('/index.html');
});

module.exports = router;
