import {
  sendNotification,
} from './notification';

const {
  getInstance,
} = require('../firebase/firebase');


const {

  homeOwnersPath,
  studentsPath,
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
      addressCoordinate: user.addressCoordinate,
      email: user.email,
      telephoneNr: user.telephoneNr,
      universityName: user.universityName,
    };
    const updateS = {};
    updateS[studentsPath + user.uid] = userDataAndUserId;
    firebase
      .database()
      .ref()
      .update(updateS);
  } else {
    const userDataAndUserId = {
      userId: user.uid,
      firstName: user.firstName,
      lastName: user.lastName,
      addressCoordinate: user.addressCoordinate,
      email: user.email,
      telephoneNr: user.telephoneNr,
    };
    const updateHO = {};
    updateHO[homeOwnersPath + user.uid] = userDataAndUserId;
    firebase
      .database()
      .ref()
      .update(updateHO);
  }
  sendNotification('Stored Success!');
}
