// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';

import update from '../helpers/update';
import header from '../helpers/header';

import eventListenerStudent from './eventListener_student';

import status from './status';
import {
  userPath,
  userFavorites,
  homesPath,
  homesSortedPath,
} from './path_db';

import {
  objectToArray,
} from '../helpers/cool_functions';
import {
  getDistance,
} from '../helpers/mapGent_functions';


// Import the template to use
const homeStudentTemplate = require('../templates/home_student.handlebars');

const {
  getInstance,
} = require('../firebase/firebase');

const firebase = getInstance();

// update distance every signedIn student
const updateDistanceBtwSchoolAndHome = (userUID) => {
  const database = firebase.database();
  database.ref(userPath + userUID).on('value', (userInfo) => {
    localStorage.setItem('currentStudentLong', userInfo.val().universityLong);
    localStorage.setItem('currentStudentLat', userInfo.val().universityLat);
    localStorage.setItem('currentUserName', `${userInfo.val().firstName} ${userInfo.val().lastName}`);
  });


  database.ref(homesPath).once('value', (snapshot) => {
    snapshot.forEach((oneHome) => {
      const distance = getDistance(localStorage.getItem('currentStudentLat'), localStorage.getItem('currentStudentLong'),
        oneHome.val().latitude, oneHome.val().longtidute, 'K');
      firebase.database().ref(`${homesPath + oneHome.val().homeKey}/distanceFromStudent`).set(distance);
    });
  });
};


export default () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      localStorage.setItem('currentUserUid', user.uid);
      localStorage.setItem('homeCounter', 0);
      status.currentUserUid = user.uid;

      updateDistanceBtwSchoolAndHome(user.uid);


      const database = firebase.database().ref(homesPath);
      database.on('value', (snapshot) => {
        // const homes = snapshot.val();
        // Run the update helper to update the template
        const homes = snapshot.val();


        // convert homes to array
        const homesArr = objectToArray(homes);
        const refFavs = firebase.database().ref(userFavorites + user.uid);
        refFavs.on('value', (favs) => {
          let userfavorites = favs.val();

          userfavorites = objectToArray(userfavorites);

          const userFavoriteHomes = [];

          userfavorites.forEach((userfavorite) => {
            const refFavHomes = firebase.database().ref(homesPath + userfavorite.homeKey);
            refFavHomes.once('value', (home) => {
              userFavoriteHomes.push(home.val());
            });
          });


          // eslint-disable-next-line prefer-destructuring

          if (localStorage.getItem('filtered') !== 'true') {
            firebase.database().ref(homesSortedPath).set(homes);
            firebase.database().ref(homesSortedPath).on('value', (sortedHomes) => {
              const modeRate = (localStorage.getItem('modeRate') === 'true');
              const modeMap = (localStorage.getItem('modeMap') === 'true');
              const modeList = (localStorage.getItem('modeList') === 'true');
              const modeFavorites = (localStorage.getItem('modeFavorites') === 'true');
              update(compile(homeStudentTemplate)({
                homes: sortedHomes.val(),
                userFavoriteHomes,
                modeRate,
                modeMap,
                modeList,
                modeFavorites,
              }));
              // console.log(`modes ${modeRate} ${modeMap} ${modeList} ${modeFavorites} `);
              header();
              //= ============----------------------------------------------EVENT LISTENER
              eventListenerStudent(homes, homesArr, user.uid);
            });
          } else {
            firebase.database().ref(homesSortedPath).on('value', (sortedHomes) => {
              const modeRate = (localStorage.getItem('modeRate') === 'true');
              const modeMap = (localStorage.getItem('modeMap') === 'true');
              const modeList = (localStorage.getItem('modeList') === 'true');
              const modeFavorites = (localStorage.getItem('modeFavorites') === 'true');
              update(compile(homeStudentTemplate)({
                homes: sortedHomes.val(),
                userFavoriteHomes,
                modeRate,
                modeMap,
                modeList,
                modeFavorites,

              }));
              header();
              eventListenerStudent(homes, homesArr, user.uid);
            });
          }
        });
      });
    } else {
      window.location.replace('#/');
    }
  });
};
