// firebase-admin-config.js
const admin = require('firebase-admin');
const serviceAccount = require('./efforts-8c26f-firebase-adminsdk-v03ej-abd8f51a57.json'); // Replace with the path to your Firebase service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com' // Replace with your database URL
});

module.exports = admin;
