const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
  apiKey: 'AIzaSyAUE0JuNKOOb7GP0wBfM3Nyk92hQ6uVMvg',
  authDomain: 'project-gohome.firebaseapp.com',
  databaseURL: 'https://project-gohome.firebaseio.com',
  projectId: 'project-gohome',
  storageBucket: 'project-gohome.appspot.com',
  messagingSenderId: '846500383353',
};

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};
