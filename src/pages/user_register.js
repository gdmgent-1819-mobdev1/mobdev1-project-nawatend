// for signing Up
import {
  compile,
} from 'handlebars';
// Import the update helper
import update from '../helpers/update';
import {

  Student,
  HomeOwner,
} from './classes';

import storeUserDB from './user_db';
// Only import the compile function from handlebars instead of the entire library


const {
  getInstance,
} = require('../firebase/firebase');


const firebase = getInstance();
let userType;

function signUp(e, usertype) {
  e.preventDefault();

  const firstName = document.getElementById('signup_f_name').value;
  const lastName = document.getElementById('signup_l_name').value;
  const address = document.getElementById('signup_address').value;
  const email = document.getElementById('signup_email').value;
  const password = document.getElementById('signup_password').value;

  const telefoonNr = document.getElementById('signup_telefoon_nr').value;
  const universityName = document.getElementById('signup_university_name').value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((response) => {
      if (usertype === 'student') {
        console.log(userType);
        // User is signed in.
        const userProfile = new Student(
          response.user.uid,
          firstName,
          lastName,
          address,
          email,
          telefoonNr,
          universityName,
        );
        storeUserDB(e, userProfile, userType);
        console.log(`Student Registered- ${userProfile.firstName}`);
      } else {
        const userProfile = new HomeOwner(
          response.user.uid,
          firstName,
          lastName,
          address,
          email,
          telefoonNr,
        );
        storeUserDB(e, userProfile, userType);
        console.log(`RoomOwner Registered- ${userProfile.firstName}`);
      }


      console.log(`success sign up ${response.user.uid}`);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode, errorMessage);
      document.getElementById('signup_error').innerHTML = `${errorCode} - ${errorMessage}`;
    });
}

// Import the template to use
const registerTemplate = require('../templates/register.handlebars');

export default () => {
  update(compile(registerTemplate)());

  const btnSignUp = document.getElementsByClassName('signup__text')[0];
  const selectStudent = document.getElementById('select_student');
  const selectHomeOwner = document.getElementById('select_homeOwner');
  const universityName = document.getElementById('signup_university_name');
  userType = 'student';

  selectStudent.addEventListener('click', () => {
    console.log('select Student');
    userType = 'student';

    universityName.classList.remove('remove');
  }, false);

  selectHomeOwner.addEventListener('click', () => {
    universityName.classList.add('remove');
    userType = 'homeOwner';
    console.log('select Home Owner');
  }, false);

  btnSignUp.addEventListener('click', (e) => {
    signUp(e, userType);
  }, false);
};
