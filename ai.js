const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

let users = {};

// Initialize GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI('*****************************');  //Add API key here
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

// Handle the AI question/response with debate assistant context
app.post('/ask', async (req, res) => {
    const { question } = req.body;
    console.log('Received question:', question);

    try {
        // Provide context with examples of debate-style input-output pairs
        const contextExamples = `
            input: "Raising the minimum wage is essential for reducing income inequality. It ensures that workers earn a livable wage and boosts their purchasing power."
            output: 
            1. Strengths of User Argument:
                - Addresses income inequality and livable wages.
                - Highlights the benefit of increased purchasing power.
            2. Suggested Improvements:
                - Consider potential impacts on small businesses and employment.
                - Provide evidence of positive outcomes from minimum wage increases in different regions.
            3. Counterargument:
                - "Raising the minimum wage could lead to higher costs for businesses, which might result in job losses or increased prices for consumers. It’s important to balance wage increases with economic conditions and business sustainability."
            4. Feedback:
                - Your argument effectively highlights the benefits of raising the minimum wage. Addressing potential drawbacks and providing data on various case studies will make your argument more robust.

            input: "Electric vehicles (EVs) are a key solution to reducing carbon emissions from transportation. They are more energy-efficient and help combat climate change."
            output: 
            1. Strengths of User Argument:
                - Emphasizes the environmental benefits of EVs.
                - Points out energy efficiency and climate change mitigation.
            2. Suggested Improvements:
                - Discuss the challenges related to EV infrastructure and battery production.
                - Mention advancements in technology that address these challenges.
            3. Counterargument:
                - "While EVs reduce carbon emissions, the production of batteries involves significant environmental impact and resource extraction. Additionally, the current charging infrastructure may not support widespread adoption."
            4. Feedback:
                - Your argument on the benefits of EVs is clear and compelling. To strengthen it, include considerations of the entire lifecycle of EVs and ongoing improvements in technology and infrastructure.

            input: "${question}"
            output:
        `;

        // Generate text using the AI model with the context-enhanced prompt
        const result = await model.generateContent(contextExamples);
        const aiResponse = result.response.text();

        // Format the response with stars and line breaks
        const sentences = aiResponse.split('.').filter(sentence => sentence.trim());
        const formattedResponse = sentences.map(sentence => `${sentence.trim()}.`).join('<br><br>');

        res.send(formattedResponse);
    } catch (error) {
        console.error('Error generating content:', error.message || error);
        res.status(500).send('Something went wrong!');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
