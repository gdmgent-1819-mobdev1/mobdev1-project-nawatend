// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';

import update from '../helpers/update';
import header from '../helpers/header';

// Only import the compile function from handlebars instead of the entire library
import {
  homesPath,
} from './path_db';


const homeGuestTemplate = require('../templates/home_guest.handlebars');
// const {
//     sortByDistance,
// } = require('./sort');

const {
  getInstance,
} = require('../firebase/firebase');


const firebase = getInstance();


export default () => {
  localStorage.setItem('currentUserName', 'Best Guest Ever');
  localStorage.setItem('currentUserType', null);
  const database = firebase.database().ref(homesPath);
  database.on('value', (snapshot) => {
    // const homes = snapshot.val();
    // Run the update helper to update the template
    const homes = snapshot.val();
    // console.log('HOME LIST: ');
    // console.log(homes);

    const isGuest = localStorage.getItem('guest');

    update(compile(homeGuestTemplate)({
      homes,
      isGuest,
    }));
    header();


    const modeList = document.getElementById('mode__list--content');
    modeList.style.zIndex = '1';
    // ------------------------------------------------------------------Listen carefully event

    // const btnsViewHome = [...document.getElementsByClassName('btn__viewhome')];
    // btnsViewHome.forEach((btnViewHome) => {
    //   btnViewHome.addEventListener('click', () => {
    //     const selectedHomeKey = btnViewHome.getAttribute('data-homeKey');
    //     status.currentViewHomeKey = selectedHomeKey;
    //     localStorage.setItem('currentViewHomeKey', selectedHomeKey);
    //     console.log(`btnViewHOme owner Clicked --- ${selectedHomeKey}`);
    //   });
    // });
  });
};
