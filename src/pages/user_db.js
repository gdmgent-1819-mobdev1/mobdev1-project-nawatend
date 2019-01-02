import {
  sendNotification,
} from './notification';

const {
  getInstance,
} = require('../firebase/firebase');


const {


  userPath,
} = require('./path_db');

const firebase = getInstance();

export default function storeUserDB(e, user, userType) {
  e.preventDefault();

  //   let authorName = firebase.auth().currentUser.displayName;
  //   let title = document.getElementById("title").value;
  //   let content = CKEDITOR.instances.editor1.getData();
  //   let datetime = new Date().toLocaleString();
  //   let userID = firebase.auth().currentUser.uid;

  // Write the new user's data simultaneously
  if (userType === 'student') {
    const userDataAndUserId = {
      userId: user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      telephoneNr: user.telephoneNr,
      userType: user.userType,
      universityName: user.universityName,
      universityLong: user.universityLong,
      universityLat: user.universityLat,
    };
    const updateS = {};
    updateS[userPath + user.uid] = userDataAndUserId;
    firebase
      .database()
      .ref()
      .update(updateS);
    window.location.replace('#/');
    sendNotification('Register Succeed!');
  } else {
    const userDataAndUserId = {
      userId: user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      telephoneNr: user.telephoneNr,
      userType: user.userType,
    };
    const updateHO = {};
    updateHO[userPath + user.uid] = userDataAndUserId;
    firebase
      .database()
      .ref()
      .update(updateHO);
    window.location.replace('#/');
    sendNotification('Register Succeed!');
  }
}
