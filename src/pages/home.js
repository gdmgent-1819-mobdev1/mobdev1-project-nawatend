// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';
import mapboxgl from 'mapbox-gl';
import update from '../helpers/update';

// Only import the compile function from handlebars instead of the entire library

import config from '../config';
import status from './status';


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

export default () => {
  // Data to be passed to the template

  if (status.statusSignIn) {
    // Return the compiled template to the router

    update(compile(homeTemplate)());
    console.log(`Home: ${status.statusSignIn}`);
    initMap();
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


    const btnAddHome = document.getElementById('home_add');
    btnAddHome.addEventListener('click', () => {
      const url = 'https://datatank.stad.gent/4/wonen/kotatgent.json';

      fetch(url, {
        method: 'GET',
      })
        .then(response => response.json())
        .then((data) => {
          console.log(data);
        });

      if (firebase) {
        const database = firebase.database().ref('/homes');
        database.on('value', (snapshot) => {
          const homes = snapshot.val();
          // Run the update helper to update the template
          if (homes) {
            console.log('asdsa');
          }
        });
      }
    }, false);
  } else {
    console.log(`Home: ${status.statusSignIn}`);
  }
};
