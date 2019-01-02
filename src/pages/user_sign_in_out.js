import status from './status';

// import HomeStudent from './home_student';
// import HomeHomeOwner from './home_homeowner';

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
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          status.currentUserUid = user.uid;

          // User is signed in.
          const database = firebase.database().ref(`users/${user.uid}`);
          database.on('value', (snapshot) => {
            // const homes = snapshot.val();
            // Run the update helper to update the template
            const userInfo = snapshot.val();
            status.userType = userInfo.userType;
            localStorage.setItem('currentUserType', userInfo.userType);

            if (localStorage.getItem('currentUserType') === 'student') {
              window.location.replace('#/home_student');
              // HomeStudent();
            } else {
              window.location.replace('#/home_homeowner');
              // HomeHomeOwner();
            }
            console.log(userInfo.userType);
          });
        } else {
          // No user is signed in.
          console.log('NOT LOGGED IN!');
        }
      });


      console.log(`User uid: ${response.user.uid} statusSignIn: ${status.statusSignIn}`);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      document.getElementById('signin_error').innerHTML = `${errorCode} - ${error}`;
      sendNotification('Failed To Sign In', true);
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
        localStorage.setItem('signInStatus', false);
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
      document.getElementById('signin_error').innerHTML = '';
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // An error happened.
      document.getElementById('signin_error').innerHTML = `${errorCode} - ${errorMessage}`;
    });
}


// export function checkIfUserIsStudent(){


// }
