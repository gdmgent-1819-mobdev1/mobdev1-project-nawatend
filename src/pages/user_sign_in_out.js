// // sigining in
// import {
//   compile,
// } from 'handlebars';
// // Import the update helper
// import Navigo from 'navigo';
// import update from '../helpers/update';
import status from './status';
import Home from './home';

const {
  getInstance,
} = require('../firebase/firebase');


const {
  sendNotification,
} = require('./notification');

const firebase = getInstance();
// const {
//   router,
// } = require('../index.js');
// const homeTemplate = require('../templates/home.handlebars');

export function signIn(e) {
  e.preventDefault();

  const email = document.getElementById('signin_email').value;
  const password = document.getElementById('signin_password').value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      sendNotification('You are now logged in successfully!');
      // if sign in succeed, go to home page
      // router.navigate('/home.js');

      status.statusSignIn = true;

      Home();
      console.log(`${response.user.uid} statusSignIn: ${status.statusSignIn}`);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById('signin_error').innerHTML = `${errorCode} - ${error}`;
    });
}

export function signOut() {
  firebase
    .auth()
    .signOut()
    .then(
      () => {
        sendNotification('You are sign out!');
        document.getElementById('signin_password').value = '';
      },
      (error) => {
        console.error('Sign Out Error', error);
      },
    );
}

// Only works with https, https, chrome
export function signInGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      // const token = result.credential.accessToken;
      // The signed-in user info.
      // const user = result.user;
      // ...
      console.log(result);

      sendNotification('Google Signed In: Success!');
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      // const credential = error.credential;
      // ...
      console.log(`${errorCode} == ${errorMessage}`);
      document.getElementById('Signin_error').innerHTML = `${errorCode} - ${errorMessage}`;
    });

  //   firebase.auth().signInWithRedirect(provider);
}

// forgot my pw whuaaat
export function forgottenPasswordHandle(email) {
  const auth = firebase.auth();

  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      sendNotification('Password Recovery: Check E-mail');
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // An error happened.
      document.getElementById('signin_error').innerHTML = `${errorCode} - ${errorMessage}`;
    });
}


// export default () => {
//   update(compile(signedInTemplate)());

//   const btnSignIn = document.getElementById('btnSignIn');
//   const btnSignInGoogle = document.getElementById('btnSignInGoogle');

//   btnSignIn.addEventListener('click', (e) => {
//     signIn(e);
//     console.log('signin clicked');
//   }, false);

//   btnSignInGoogle.addEventListener('click', (e) => {
//     signInGoogle(e);
//   }, false);
// };
