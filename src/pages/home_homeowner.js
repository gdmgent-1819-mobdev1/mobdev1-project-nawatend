// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';

import update from '../helpers/update';
import header from '../helpers/header';

import {
  storeHomeDB,
  deleteHomeFromDB,
} from './room_upload_delete';

import {
  userPath,
  homesPath,
} from './path_db';

import {
  objectToArray,
} from '../helpers/cool_functions';

import storeImageToDB from './store_image_db';

import {
  getCoordinateOfAddress,
} from '../helpers/mapGent_functions';


const homeHomeOwnerTemplate = require('../templates/home_homeowner.handlebars');

const {
  getInstance,
} = require('../firebase/firebase');

const firebase = getInstance();

function pushNewHomeToDB(e) {
  storeHomeDB(e);
}

export default () => {
  // Data to be passed to the template
  // const testCoor = [3.725355, 51.040913];
  // const isIn = isInGent(testCoor);
  // console.log(isIn);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebase.database().ref(userPath + user.uid).on('value', (userInfo) => {
        localStorage.setItem('currentUserName', `${userInfo.val().firstName} ${userInfo.val().lastName}`);
      });
      localStorage.setItem('currentUserType', false);
      let homesArr = [];
      const database = firebase.database().ref(homesPath);
      database.on('value', (snapshot) => {
        // const homes = snapshot.val();
        // Run the update helper to update the template
        let homes = snapshot.val();
        // console.log('HOME LIST: ');
        // console.log(homes);
        homesArr = [];
        // const objs = sortHomes('floor', homes, false);
        // console.log('HOME LIST sort floor: ');
        // console.log(objs);
        if (homes !== null) {
          homes = objectToArray(homes);
          homes.forEach((home) => {
            // console.log(home);
            if (user.uid === home.homeownerUID) {
              homesArr.push(home);
            } else {
              console.log(`Not his home -- ${user.uid}---${home.homeownerUID}`);
            }
          });
        }

        update(compile(homeHomeOwnerTemplate)({
          homesArr,
        }));
        header();

        // address to coordinate while typing
        const addressName = document.getElementById('home_address');
        addressName.addEventListener('input', () => {
          getCoordinateOfAddress(addressName.value.replace(/ /g, '%20'));
        }, false);
        // getCoordinateOfAddress(urlAddress);
        // console.log(urlAddress);

        // store image to firebase storage
        const imageEl = document.getElementById('home_image_link');
        const uploadProgress = document.getElementById('upload_progress');
        storeImageToDB(imageEl, uploadProgress);


        const modeList = document.getElementById('mode__list--content');
        modeList.style.zIndex = '1';

        // ------------------------------------------------------------------Listen carefully event
        const btnAddHome = document.getElementById('home_add');
        const btnPublishHome = document.getElementById('btnPublishHome');
        const formHome = document.getElementById('form_home');
        const btnCloseFormHome = document.getElementById('btnCloseFormHome');

        const btnsDeleteHome = [...document.getElementsByClassName('btn__delete')];
        // const btnsViewHome = [...document.getElementsByClassName('btn__viewhomeReal')];
        // const btnsEditHome = [...document.getElementsByClassName('btn__edithome')];

        // btnsViewHome.forEach((btnViewHome) => {
        //   btnViewHome.addEventListener('click', () => {

        //   });
        // });

        // btnsEditHome.forEach((btnEditHome) => {
        //   btnEditHome.addEventListener('click', () => {
        //     const selectedHomeKey = btnEditHome.getAttribute('data-homeKey');
        //     status.currentViewHomeKey = selectedHomeKey;
        //     localStorage.setItem('currentViewHomeKey', selectedHomeKey);

        //     console.log(`btnViewHOme owner Clicked --- ${selectedHomeKey}`);
        //   });
        // });

        btnsDeleteHome.forEach((btnDeleteHome) => {
          btnDeleteHome.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedHomeKey = btnDeleteHome.getAttribute('data-homeKey');
            deleteHomeFromDB(selectedHomeKey);
            console.log('btnDeleteHome Clicked');
          });
        });


        btnCloseFormHome.addEventListener('click', () => {
          formHome.classList.remove('form__home--active');
        });
        btnPublishHome.addEventListener('click', (e) => {
          pushNewHomeToDB(e);
        });
        btnAddHome.addEventListener('click', () => {
          formHome.classList.add('form__home--active');
        }, false);
      });
    } else {
      window.location.replace('#/');
    }
  });
};
