import student from './status';

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


export default function storeHomeDB(e) {
  e.preventDefault();

  const address = document.getElementById('home_address').value;
  const price = document.getElementById('home_price').value;
  const insurancePrice = document.getElementById('home_insurance_price').value;
  const description = document.getElementById('home_description').value;
  const floor = document.getElementById('home_floor').value;
  const maxTenant = document.getElementById('home_max_tenant').value;
  const furnitured = document.getElementById('home_furnitured').value;
  const imageLink = document.getElementById('home_image_link').value;
  const totalRooms = document.getElementById('home_total_rooms').value;

  const toilet = document.getElementById('home_kitchen').value;
  const shower = document.getElementById('home_kitchen').value;
  const bath = document.getElementById('home_kitchen').value;
  const kitchen = document.getElementById('home_kitchen').value;
  const type = document.getElementById('home_kitchen').value;

  const currentOwnerUid = firebase.auth().currentUser.uid;
  student = true;
  if (address !== '' && price !== '') {
    if (!student) {
      const newHomeKey = firebase
        .database()
        .ref(homesPath)
        .push({}).key;

      const newHome = new Home(
        currentOwnerUid,
        newHomeKey,
        address,
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
      );

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
    }
    console.log('stored success');
    sendNotification('Stored Success!');
  } else {
    console.log('stored FAILED');
    sendNotification('Stored FAILED!');
  }
}
