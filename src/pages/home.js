// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';
import mapboxgl from 'mapbox-gl';
import update from '../helpers/update';

// Only import the compile function from handlebars instead of the entire library

import config from '../config';
import status from './status';
import {
  storeHomeDB,
} from './room_upload_delete';

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

const {
  getInstance,
} = require('../firebase/firebase');

const firebase = getInstance();


function initMap() {
  if (config.mapBoxToken) {
    mapboxgl.accessToken = config.mapBoxToken;
    // eslint-disable-next-line no-unused-vars
    const map = new mapboxgl.Map({
      container: 'map',
      center: [-74.50, 40],
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 10,
    });
  } else {
    console.error('Mapbox will crash the page if no access token is given.');
  }
}

function filterOptions() {
  const btnFilterOptions = document.getElementById('filter_options');
  const containerRanges = document.getElementsByClassName('container__ranges')[0];

  btnFilterOptions.addEventListener('click', () => {
    // containerRanges.style.zIndex = '1';
    containerRanges.classList.toggle('toggle__container__ranges');
  });
}


function pushNewHomeToDB(e) {
  storeHomeDB(e);
}

function userTypeIsHomeOwner() {
  const student = false;

  let loading = false;
  if (firebase) {
    const database = firebase.database().ref('homes/');
    database.on('value', (snapshot) => {
      // const homes = snapshot.val();
      // Run the update helper to update the template
      const homes = snapshot.val();
      console.log(homes);
      update(compile(homeTemplate)({
        homes,
        loading,
        student,
      }));
      loading = true;
      if (loading) {
        const modeList = document.getElementById('mode__list--content');
        modeList.style.zIndex = '1';


        const btnAddHome = document.getElementById('home_add');
        const btnPublishHome = document.getElementById('btnPublishHome');
        const formHome = document.getElementById('form_home');
        const btnCloseFormHome = document.getElementById('btnCloseFormHome');

        btnCloseFormHome.addEventListener('click', () => {
          formHome.classList.remove('form__home--active');
        });
        btnPublishHome.addEventListener('click', (e) => {
          pushNewHomeToDB(e);
        });
        btnAddHome.addEventListener('click', () => {
          // const url = 'https://datatank.stad.gent/4/wonen/kotatgent.json';
          formHome.classList.add('form__home--active');
          // fetch(url, {
          //   method: 'GET',
          // })
          //   .then(response => response.json())
          //   .then((data) => {
          //     console.log(data);
          //   });
        }, false);
      }
    });
  }


  console.log(`Home: ${status.statusSignIn} ${firebase.auth().currentUser.uid}`);
}


export default () => {
  // Data to be passed to the template
  const loading = false;
  if (status.statusSignIn) {
    if (status.student) {
      // Return the compiled template to the router
      //   const homes = getListOfHomes();
      //   console.log(`this is homes: ${homes}`);

      const student = true;
      if (firebase) {
        const database = firebase.database().ref('homes/');
        database.on('value', (snapshot) => {
          // const homes = snapshot.val();
          // Run the update helper to update the template
          const homes = snapshot.val();
          console.log(homes);
          update(compile(homeTemplate)({
            homes,
            loading,
            student,
          }));
          initMap();


          console.log(`Home: ${status.statusSignIn}`);


          const btnRate = document.getElementById('mode_rate');
          const btnMap = document.getElementById('mode_map');
          const btnList = document.getElementById('mode_list');
          const modeContent = [...document.getElementsByClassName('mode--content')];
          btnRate.addEventListener('click', () => {
            btnRate.classList.add('mode__active');
            btnMap.classList.remove('mode__active');
            btnList.classList.remove('mode__active');

            modeContent[0].style.zIndex = '0';
            modeContent[1].style.zIndex = '-1';
            modeContent[2].style.zIndex = '-1';
          });

          btnMap.addEventListener('click', () => {
            btnRate.classList.remove('mode__active');
            btnMap.classList.add('mode__active');
            btnList.classList.remove('mode__active');

            modeContent[0].style.zIndex = '-1';
            modeContent[1].style.zIndex = '0';
            modeContent[2].style.zIndex = '-1';
          });

          btnList.addEventListener('click', () => {
            btnRate.classList.remove('mode__active');
            btnMap.classList.remove('mode__active');
            btnList.classList.add('mode__active');

            modeContent[0].style.zIndex = '-1';
            modeContent[1].style.zIndex = '-1';
            modeContent[2].style.zIndex = '0';
          });

          filterOptions();
        });
      }
    } else {
      userTypeIsHomeOwner();
    }
  } else {
    console.log(`Home: ${status.statusSignIn}`);
  }
};
