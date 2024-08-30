const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

let users = {};

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI('AIzaSyC3LAgP8FNdZelxI_mEPrav1Ti9c1HEcvM');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Serve login page by default
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Serve the main chatbot page
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Store the user credentials in the in-memory store
    if (username && password && email) {
        users[username] = { password, email };
        // Redirect to the chatbot page after successful signup
        res.redirect('/index.html');
    } else {
        res.status(400).send('All fields are required.');
    }
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Check if the user exists and the password matches
    if (users[username] && users[username].password === password) {
        // Successful login, redirect to the chatbot page
        res.redirect('/index.html');
    } else {
        // Authentication failed, send an error message
        res.status(401).send('Invalid username or password.');
    }
});

// Handle POST request to /ask
app.post('/ask', async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).send('Question is required.');
    }

    try {
        const result = await model.generateContent(question);
        const response = await result.response;
        const text = await response.text();
        res.send(text);
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).send('An error occurred while generating content.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
