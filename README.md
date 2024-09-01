This is Projet developed during Hackera hackathon. Our problem statement is AI inhanced online debate platform which provides real time feedback,records uses progress and also do fact checking,
in this project we have made a chatbot which answer your question and provides  personalized feedback to user about his argument and suggest some improvements to user.

We have used:
1) Gemini API - To integrate ai in our project
2) Firebase - To authenticate users (Partially working)
3) Vertex AI - To give context to AI chatbot

Steps to follow:
Firstly get an gemini api by signing on Gemini AI studio ie  https://ai.google.dev/aistudioThen place it in the place of ************ in ai.js file . 
For Firebase authentication add firebase-config.js file that stores the Stores the API ,project Id which is used to connect website to firebase 
For datastorage we used firestore for that  add firebase-admin-config.js is loaded in project which contains database url.
Used Vertex AI for prompt improvement ad adding context to chatbot.
