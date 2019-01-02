const {
  getInstance,
} = require('../firebase/firebase');


const {

  userFavorites,
} = require('./path_db');

const {
  sendNotification,
} = require('./notification');

const firebase = getInstance();


export function addFavoriteHomeToCurrentUser(e, userUid, homeKey) {
  e.preventDefault();

  let favHomeExist = false;
  firebase.database().ref(userFavorites + userUid).once('value', (snapshot) => {
    snapshot.forEach((snap) => {
      if (snap.val().homeKey === homeKey) {
        favHomeExist = true;
      }
    });
  });

  if (!favHomeExist) {
    const homeKeyObject = {
      homeKey,
    };

    firebase
      .database()
      .ref(userFavorites + userUid)
      .push(homeKeyObject);

    console.log('Added To Your Favorite');

    sendNotification("Added To Your Favorite's");
  } else {
    console.log('Already In fav list');
    sendNotification('Already In your Favorite List');
  }
}

export function removeFavoriteHomeToCurrentUser(e, userUid, homeKey) {
  e.preventDefault();
  console.log(`${userUid}----${homeKey}`);
  // .orderByChild('homeKey').equalTo(homeKey)
  const refFavHome = firebase.database().ref(`${userFavorites + userUid}/`);
  refFavHome.once('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().homeKey === homeKey) {
        const ref = firebase.database().ref(`${userFavorites + userUid}/${childSnapshot.key}`);
        ref.remove();
      }
    });
  });
  console.log('removed from fav');
}
