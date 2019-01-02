import {
  sendNotification,
} from '../pages/notification';

const {
  getInstance,
} = require('../firebase/firebase');


const {
  conversationsPath,
} = require('../pages/path_db');


const firebase = getInstance();


export function sendMessage(fromUID, toUID, message, studentName, homeownerName, userType) {
  const conversation = {
    fromUID,
    toUID,
    studentName,
    homeownerName,
    conversationKey: `${fromUID}>${toUID}`,
  };

  const database = firebase.database();
  let keyOfMessage = '';
  const messageText = {
    message,
    time: new Date().toLocaleString(),
    userType,
  };
  database.ref(`${conversationsPath}${fromUID}>${toUID}`).once('value', (snap) => {
    if (snap.val() !== null) {
      database.ref(`${conversationsPath}${fromUID}>${toUID}/messages/`).once('value', (snapshot) => {
        if (snap.val() !== null) {
          keyOfMessage = `${snapshot.numChildren() + 111}-message`;
          const databaseM = database.ref(`${conversationsPath}${fromUID}>${toUID}/messages/`);
          databaseM.child(keyOfMessage).set(messageText);
          console.log('Message SENT');
          sendNotification('Message Sent');
        } else {
          // console.log('THISSSS  EMPTY');
        }
      });
    } else {
      console.log(' New conversation here');
      database.ref(conversationsPath).child(`${fromUID}>${toUID}`).set(conversation);

      database.ref(`${conversationsPath}${fromUID}>${toUID}/messages/`).once('value', (snapshot) => {
        keyOfMessage = `${snapshot.numChildren() + 111}-message`;
        const databaseM = database.ref(`${conversationsPath}${fromUID}>${toUID}/messages/`);
        databaseM.child(keyOfMessage).set(messageText);
        console.log('Message SENT');
        sendNotification('Message Sent');
      });
    }
  });
}


export function recieve() {
  // not needed
}
