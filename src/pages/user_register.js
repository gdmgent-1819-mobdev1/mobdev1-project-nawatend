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
import {
  isInGent,
  getCoordinateOfAddress,
} from '../helpers/mapGent_functions';
import {
  sendNotification,
} from './notification';

const {
  getInstance,
} = require('../firebase/firebase');


const firebase = getInstance();
let userType;

function sendVerificationEmail(user) {
  user
    .sendEmailVerification()
    .then(() => {
      console.log('email sent');
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(errorCode, errorMessage);
    });
}

function signUp(e, usertype) {
  e.preventDefault();
  let selectedUserType;

  const selected = document.getElementById('select_usertype').value;
  if (selected === 'Student') {
    selectedUserType = document.getElementById('select_student').value;
  } else if (selected === 'HomeOwner') {
    selectedUserType = document.getElementById('select_homeOwner').value;
  }

  console.log(selectedUserType);
  const firstName = document.getElementById('signup_f_name').value;
  const lastName = document.getElementById('signup_l_name').value;
  const email = document.getElementById('signup_email').value;
  const password = document.getElementById('signup_password').value;

  const telefoonNr = document.getElementById('signup_telefoon_nr').value;
  const universityName = document.getElementById('signup_university_name').value;


  // address to coordinate -> forward geocoding
  getCoordinateOfAddress(universityName.replace(/ /g, '%20'));

  const longtitude = localStorage.getItem('homeAddressLong');
  const latitude = localStorage.getItem('homeAddressLat');

  const isStudentSchoolInGentZones = isInGent([longtitude, latitude]);
  console.log(isStudentSchoolInGentZones);
  if (isStudentSchoolInGentZones) {
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
            email,
            telefoonNr,
            userType,
            universityName,
            localStorage.getItem('homeAddressLong'),
            localStorage.getItem('homeAddressLat'),
          );
          storeUserDB(e, userProfile, userType);
          // console.log(`Student Registered- ${userProfile.firstName}`);
        } else {
          const userProfile = new HomeOwner(
            response.user.uid,
            firstName,
            lastName,
            email,
            telefoonNr,
            userType,
          );
          storeUserDB(e, userProfile, userType);
          // console.log(`RoomOwner Registered- ${userProfile.firstName}`);
        }
        console.log(`success sign up ${response.user.uid}`);
        sendVerificationEmail(response.user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(error);
        sendNotification('Register Failed', true);
        document.getElementById('signup_error').innerHTML = `${errorCode} - ${errorMessage}`;
      });
  } else {
    document.getElementById('signup_error').innerHTML = 'Your School/Address is not in Ghent';
    sendNotification('Your School Address Is Not In Ghent', true);
  }
}

// Import the template to use
const registerTemplate = require('../templates/register.handlebars');

export default () => {
  update(compile(registerTemplate)());

  const btnSignUp = document.getElementsByClassName('signup__text')[0];
  const selectStudent = document.getElementById('select_student');
  const selectHomeOwner = document.getElementById('select_homeOwner');
  const universityName = document.getElementById('signup_university_name');


  universityName.addEventListener('input', () => {
    getCoordinateOfAddress(universityName.value.replace(/ /g, '%20'));
  }, false);

  userType = 'student';

  selectStudent.addEventListener('click', () => {
    userType = 'student';

    universityName.classList.remove('remove');
  }, false);

  selectHomeOwner.addEventListener('click', () => {
    universityName.classList.add('remove');
    userType = 'homeOwner';
  }, false);

  btnSignUp.addEventListener('click', (e) => {
    signUp(e, userType);
  }, false);
};
