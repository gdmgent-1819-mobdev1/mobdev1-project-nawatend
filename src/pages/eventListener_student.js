/* eslint-disable no-param-reassign */
// Only import the compile function from handlebars instead of the entire library

import mapboxgl from 'mapbox-gl';

import {
  addFavoriteHomeToCurrentUser,
  removeFavoriteHomeToCurrentUser,
} from './favorite_handle';
// Only import the compile function from handlebars instead of the entire library

import config from '../config';
import status from './status';
import {

  homesSortedPath,
} from './path_db';


import {
  filterAll,
  sortByDistance,
} from './sort';


const {
  getInstance,
} = require('../firebase/firebase');

const firebase = getInstance();


function initMap(homes) {
  if (config.mapBoxToken) {
    mapboxgl.accessToken = config.mapBoxToken;
    // eslint-disable-next-line no-unused-vars
    const map = new mapboxgl.Map({
      container: 'map',
      center: [3.724958996043142, 51.053756710770074],
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 11,
    });


    homes.forEach((home) => {
      const popUp = new mapboxgl.Popup({
        offset: 25,
      });
      popUp.setText(`${home.addressName} : ${home.rentPrice} EUR`);

      new mapboxgl.Marker()
        .setLngLat([home.longtidute, home.latitude])
        .setPopup(popUp)
        .addTo(map);
    });
  } else {
    console.error('Mapbox will crash the page if no access token is given.');
  }
}

function filterOptions() {
  const btnShowFilterOptions = document.getElementById('btnShowFilterOptions');
  const filterDesktop = document.getElementById('filter_desktop');
  const btnCloseFilterOptions = document.getElementById('btnCloseFilterOptions');

  // filters value


  btnShowFilterOptions.addEventListener('click', () => {
    // containerRanges.style.zIndex = '1';
    filterDesktop.classList.toggle('filter__options--show');
  });

  btnCloseFilterOptions.addEventListener('click', () => {
    // containerRanges.style.zIndex = '1';
    filterDesktop.classList.toggle('filter__options--show');
  });
}

function rateContent(sortedHomesArr) {
  // --------------------------------------------RATE GAME

  console.log(sortedHomesArr);
  const rateAddress = document.getElementById('rate_address');
  const rateImage = document.getElementById('rate_image');
  const ratePrice = document.getElementById('rate_price');
  const rateDistance = document.getElementById('rate_distance');
  const rateSize = document.getElementById('rate_size');
  const btnViewHome = document.getElementById('btnViewHome');

  btnViewHome.innerHTML = `<a href='#/home_detail/${sortedHomesArr[localStorage.getItem('homeCounter')].homeKey}'>View</a>`;
  rateImage.innerHTML = `<img src='${sortedHomesArr[localStorage.getItem('homeCounter')].imageLink}'>`;

  rateAddress.innerText = sortedHomesArr[localStorage.getItem('homeCounter')].addressName;
  ratePrice.innerText = `${sortedHomesArr[localStorage.getItem('homeCounter')].rentPrice} EUR`;
  rateDistance.innerText = `${sortedHomesArr[localStorage.getItem('homeCounter')].distanceFromStudent} km`;
  rateSize.innerText = `${sortedHomesArr[localStorage.getItem('homeCounter')].size} m²`;
}

const eventListenerStudent = (homes, homesArr, userUID) => {
  console.log('listeningg student');
  const btnFilterReal = document.getElementById('btnFilterReal');
  btnFilterReal.addEventListener('click', () => {
    // containerRanges.style.zIndex = '1';

    localStorage.setItem('filtered', true);

    const filterRoomType = document.getElementById('filter_room_type').value;

    const filterMinPrice = document.getElementById('filter_price_min').value;
    const filterMaxPrice = document.getElementById('filter_price_max').value;


    const filterSizeMin = document.getElementById('filter_size_min').value;
    const filterSizeMax = document.getElementById('filter_size_max').value;

    const filterDistanceMin = document.getElementById('filter_distance_min').value;
    const filterDistanceMax = document.getElementById('filter_distance_max').value;

    localStorage.setItem('filterRoomType', filterRoomType);
    localStorage.setItem('filterPriceMin', filterMinPrice);
    localStorage.setItem('filterPriceMax', filterMaxPrice);


    localStorage.setItem('filterSizeMin', filterSizeMin);
    localStorage.setItem('filterSizeMax', filterSizeMax);
    localStorage.setItem('filterDistanceMin', filterDistanceMin);
    localStorage.setItem('filterDistanceMax', filterDistanceMax);

    const homesSorted = filterAll(homes);
    // console.log(homesSorted);

    firebase.database().ref(homesSortedPath).set(homesSorted);
  });
  filterOptions();
  //= ============----------------------------------------------EVENT LISTENER

  // --------------------------------------------RATE GAME
  const sortedHomesArr = sortByDistance(homesArr);
  rateContent(sortedHomesArr);

  const btnDislike = document.getElementById('btnDislike');
  const btnLike = document.getElementById('btnLike');
  const homesLength = sortedHomesArr.length - 1;
  btnLike.addEventListener('click', (e) => {
    const currentCount = localStorage.getItem('homeCounter');


    if (currentCount !== homesLength && currentCount < homesLength) {
      localStorage.setItem('homeCounter', parseInt(currentCount, 10) + 1);
      addFavoriteHomeToCurrentUser(e, userUID, sortedHomesArr[currentCount].homeKey);
      rateContent(sortedHomesArr);
    } else {
      addFavoriteHomeToCurrentUser(e, userUID, sortedHomesArr[currentCount].homeKey);
    }
  });

  btnDislike.addEventListener('click', () => {
    const currentCount = localStorage.getItem('homeCounter');

    if (currentCount !== homesLength && currentCount < homesLength) {
      localStorage.setItem('homeCounter', parseInt(currentCount, 10) + 1);
      rateContent(sortedHomesArr);
    }
  });
  // Skip routing parts - Yes, we can
  const btnRate = document.getElementById('mode_rate');
  const btnMap = document.getElementById('mode_map');
  const btnList = document.getElementById('mode_list');
  const btnFavorite = document.getElementById('mode_favorite');
  const modeContent = [...document.getElementsByClassName('mode--content')];


  if (btnRate.classList.contains('mode__active')) {
    modeContent[0].classList.remove('mode__remove');
    modeContent[1].classList.add('mode__remove');
    modeContent[2].classList.add('mode__remove');
    modeContent[3].classList.add('mode__remove');
  }

  if (btnMap.classList.contains('mode__active')) {
    modeContent[0].classList.add('mode__remove');
    modeContent[1].classList.remove('mode__remove');
    modeContent[2].classList.add('mode__remove');
    modeContent[3].classList.add('mode__remove');
  }

  if (btnList.classList.contains('mode__active')) {
    modeContent[0].classList.add('mode__remove');
    modeContent[1].classList.add('mode__remove');
    modeContent[2].classList.remove('mode__remove');
    modeContent[3].classList.add('mode__remove');
  }

  if (btnFavorite.classList.contains('mode__active')) {
    modeContent[0].classList.add('mode__remove');
    modeContent[1].classList.add('mode__remove');
    modeContent[2].classList.add('mode__remove');
    modeContent[3].classList.remove('mode__remove');
  }


  btnRate.addEventListener('click', () => {
    localStorage.setItem('modeRate', true);
    localStorage.setItem('modeMap', false);
    localStorage.setItem('modeList', false);
    localStorage.setItem('modeFavorites', false);


    btnRate.classList.add('mode__active');
    btnMap.classList.remove('mode__active');
    btnList.classList.remove('mode__active');
    btnFavorite.classList.remove('mode__active');


    modeContent[3].classList.add('mode__remove');
    modeContent[0].classList.remove('mode__remove');
    modeContent[1].classList.add('mode__remove');
    modeContent[2].classList.add('mode__remove');
  });

  btnMap.addEventListener('click', () => {
    localStorage.setItem('modeRate', false);
    localStorage.setItem('modeMap', true);
    localStorage.setItem('modeList', false);
    localStorage.setItem('modeFavorites', false);

    btnRate.classList.remove('mode__active');
    btnMap.classList.add('mode__active');
    btnList.classList.remove('mode__active');
    btnFavorite.classList.remove('mode__active');

    modeContent[0].classList.add('mode__remove');
    modeContent[1].classList.remove('mode__remove');
    modeContent[2].classList.add('mode__remove');
    modeContent[3].classList.add('mode__remove');

    initMap(homesArr);
  });

  btnList.addEventListener('click', () => {
    localStorage.setItem('modeRate', false);
    localStorage.setItem('modeMap', false);
    localStorage.setItem('modeList', true);
    localStorage.setItem('modeFavorites', false);

    btnRate.classList.remove('mode__active');
    btnMap.classList.remove('mode__active');
    btnList.classList.add('mode__active');
    btnFavorite.classList.remove('mode__active');

    modeContent[0].classList.add('mode__remove');
    modeContent[1].classList.add('mode__remove');
    modeContent[2].classList.remove('mode__remove');
    modeContent[3].classList.add('mode__remove');
  });

  btnFavorite.addEventListener('click', () => {
    localStorage.setItem('modeRate', false);
    localStorage.setItem('modeMap', false);
    localStorage.setItem('modeList', false);
    localStorage.setItem('modeFavorites', true);

    btnRate.classList.remove('mode__active');
    btnMap.classList.remove('mode__active');
    btnList.classList.remove('mode__active');
    btnFavorite.classList.add('mode__active');

    modeContent[0].classList.add('mode__remove');
    modeContent[1].classList.add('mode__remove');
    modeContent[2].classList.add('mode__remove');
    modeContent[3].classList.remove('mode__remove');
  });


  const btnsAddFav = [...document.getElementsByClassName('btn__addfavorite')];
  const btnsRemoveFav = [...document.getElementsByClassName('btn__removefavorite')];
  // const btnsViewHome = [...document.getElementsByClassName('btn__viewhome')];
  btnsAddFav.forEach((btnAddFav) => {
    btnAddFav.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUserUid = localStorage.getItem('currentUserUid');
      const selectedHomeKey = btnAddFav.getAttribute('data-homeKey');
      addFavoriteHomeToCurrentUser(e, currentUserUid, selectedHomeKey);
      console.log('btnAddFavorite Clicked');
    });
  });

  btnsRemoveFav.forEach((btnRemoveFav) => {
    btnRemoveFav.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedHomeKey = btnRemoveFav.getAttribute('data-homeKey');
      removeFavoriteHomeToCurrentUser(e, status.currentUserUid, selectedHomeKey);

      console.log('btnRemoveFavorite Clicked');
    });
  });

  // btnsViewHome.forEach((btnViewHome) => {
  //   btnViewHome.addEventListener('click', () => {
  //     console.log('btnViewFavorite Clicked');
  //   });
  // });
};

export default eventListenerStudent;
