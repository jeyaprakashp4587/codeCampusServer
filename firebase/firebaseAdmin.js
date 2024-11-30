const admin = require('firebase-admin');

// Load the service account key JSON
const serviceAccount = require('../serviceKey.json');

// Custom function to initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('Firebase Admin SDK initialized');
  } else {
    console.log('Firebase Admin SDK already initialized');
  }

  return admin;
};

module.exports = initializeFirebaseAdmin;
