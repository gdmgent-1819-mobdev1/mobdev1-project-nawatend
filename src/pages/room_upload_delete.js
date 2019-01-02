import {
  isInGent,
  getCoordinateOfAddress,
} from '../helpers/mapGent_functions';

const {
  getInstance,
} = require('../firebase/firebase');

const {

  Home,
} = require('./classes');

const {

  homesPath,
} = require('./path_db');


const {
  sendNotification,
} = require('./notification');

const firebase = getInstance();

export function deleteHomeFromDB(homeKey) {
  firebase.database().ref(`${homesPath + homeKey}`).remove();
}

export function updateHome(homeKey, homeClass) {
  const updates = {};
  updates[homesPath + homeKey] = homeClass;
  firebase
    .database()
    .ref()
    .update(updates);

  sendNotification('Home Deleted');
}
export function storeHomeDB(e) {
  e.preventDefault();

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

  const currentOwnerUid = firebase.auth().currentUser.uid;

  // not in gent zone coordinate
  let longtitude = 5.5;
  let latitude = 51.5;
  // address to coordinate -> forward geocoding
  getCoordinateOfAddress(addressName.replace(/ /g, '%20'));
  // get from localstorage
  longtitude = localStorage.getItem('homeAddressLong');
  latitude = localStorage.getItem('homeAddressLat');

  const isNewHomeInGentZones = isInGent([longtitude, latitude]);

  // const imagePathInDB = storeImageToDB(imageEl);
  // console.log(imagePathInDB);
  const imageLink = localStorage.getItem('imageLink');
  if (isNewHomeInGentZones) {
    if (addressName !== '' && price !== '') {
      const newHomeKey = firebase
        .database()
        .ref(homesPath)
        .push({}).key;

      const newHome = new Home(
        currentOwnerUid,
        newHomeKey,
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
      console.log(imageLink);
      // homeDataAndHomeID = {
      //   postid: newHomeKey,
      //   author: authorName,
      //   title: title,
      //   content: content,
      //   publishedOn: datetime,
      //   uid: userID
      // };
      const updates = {};
      updates[homesPath + newHomeKey] = newHome;
      firebase
        .database()
        .ref()
        .update(updates);

      console.log('stored new Home success');
      sendNotification('Upload Success!');
    } else {
      console.log('stored FAILED');
      sendNotification('Upload FAILED!', true);
    }
  } else {
    const error = document.getElementById('publish_error');

    document.getElementById('home_address').classList.add('box__error');
    error.innerText = 'Your Home is not in gent zones';
  }
}
