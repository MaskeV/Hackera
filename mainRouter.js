const express = require('express');
const path = require('path');

const router = express.Router();

// Serve chatbot page (index.html)
router.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = router;
