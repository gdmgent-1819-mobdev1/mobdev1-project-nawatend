import {
  compile,
} from 'handlebars';

import update from '../helpers/update';
import header from '../helpers/header';
import {
  homesPath,
  userPath,
} from './path_db';
import storeImageToDB from './store_image_db';
import {
  isInGent,
  getCoordinateOfAddress,
} from '../helpers/mapGent_functions';
import {
  sendNotification,
} from './notification';

const {
  Home,
} = require('./classes');

const homeEditTemplate = require('../templates/home_edit.handlebars');

const {
  getInstance,
} = require('../firebase/firebase');

const firebase = getInstance();


export default () => {
  const currentHomeKey = window.location.href.split('/');
  const lastPartIndex = currentHomeKey.length - 1;
  firebase.database().ref(homesPath + currentHomeKey[lastPartIndex]).once('value').then((snapshot) => {
    console.log(snapshot.val().description);
    const home = snapshot.val();

    localStorage.setItem('imageLink', home.imageLink);


    firebase.database().ref(userPath + home.homeownerUID).once('value').then((user) => {
      const roomOwnerInfo = user.val();
      update(compile(homeEditTemplate)({
        home,
        roomOwnerInfo,
      }));
      header();

      // just default, it will change
      let longtitude = home.longtitude;
      let latitude = home.latitude;

      const addressNameControle = document.getElementById('home_address');
      addressNameControle.addEventListener('input', () => {
        // address to coordinate -> forward geocoding
        getCoordinateOfAddress(addressNameControle.value.replace(/ /g, '%20'));
        // get from localstorage
        longtitude = localStorage.getItem('homeAddressLong');
        latitude = localStorage.getItem('homeAddressLat');
      }, false);


      const btnComfirmUpdate = document.getElementById('btnEditConfirm');


      // store image to firebase storage
      const imageEl = document.getElementById('home_image_link');
      const uploadProgress = document.getElementById('upload_progress');
      storeImageToDB(imageEl, uploadProgress);


      btnComfirmUpdate.addEventListener('click', () => {
        const addressName = document.getElementById('home_address').value;
        const price = document.getElementById('home_price').value;
        const insurancePrice = document.getElementById('home_insurance_price').value;
        const description = document.getElementById('home_description').value;
        const floor = document.getElementById('home_floor').value;
        const maxTenant = document.getElementById('home_max_tenant').value;

        const furnitured = document.getElementById('home_furnitured').value;
        // const imageEl = document.getElementById('home_image_link');
        const totalRooms = document.getElementById('home_total_rooms').value;

        const toilet = document.getElementById('home_toilet').value;
        const shower = document.getElementById('home_shower').value;
        const bath = document.getElementById('home_bath').value;
        const kitchen = document.getElementById('home_kitchen').value;
        const type = document.getElementById('home_type').value;
        const size = document.getElementById('home_size').value;


        console.log('btnConfirm click');
        const isUpdatedHomeInGentZones = isInGent([longtitude, latitude]);
        const imageLink = localStorage.getItem('imageLink');
        if (isUpdatedHomeInGentZones) {
          const newHome = new Home(
            home.homeownerUID,
            home.homeKey,
            addressName,
            longtitude,
            latitude,
            price,
            insurancePrice,
            description,
            floor,
            maxTenant,
            furnitured,
            imageLink,
            totalRooms,
            toilet,
            shower,
            bath,
            kitchen,
            type,
            size,
          );

          const updates = {};
          updates[homesPath + currentHomeKey[lastPartIndex]] = newHome;
          firebase
            .database()
            .ref()
            .update(updates).then(() => {
              sendNotification('Edit Confirm: Success');
              window.location.replace('#/home_homeowner');
            });
        }
      });
    });
  });
};
