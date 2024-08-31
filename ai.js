const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

let users = {};

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI('***************************');  // Add your API key here
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main chatbot page
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle signup
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (username && password && email) {
        users[username] = { password, email };
        res.redirect('/index.html');
    } else {
        res.status(400).send('All fields are required.');
    }
});

// Handle login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Implement your Firebase Authentication here
        await signInWithEmailAndPassword(auth, email, password);
        res.redirect('/index.html');
    } catch (error) {
        res.status(401).send('Invalid email or password.');
    }
});

// Handle the AI question/response
app.post('/ask', async (req, res) => {
    const { question } = req.body;
    console.log('Received question:', question);

    try {
        const result = await model.generateContent(question);
        const response = result.response.text();

        // Format the response with stars and line breaks
        const sentences = response.split('.').filter(sentence => sentence.trim());
        const formattedResponse = sentences.map(sentence => `★ ${sentence.trim()}.`).join('<br><br>');

        res.send(formattedResponse);
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).send('Something went wrong!');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
