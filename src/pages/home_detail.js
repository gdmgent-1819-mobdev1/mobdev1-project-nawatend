import {
  compile,
} from 'handlebars';

import update from '../helpers/update';
import status from './status';
import header from '../helpers/header';
import {
  userPath,
  homesPath,
} from './path_db';
import shareOnFB from './share_fb';
import {
  sendMessage,
} from '../helpers/message_handle';
import {
  addFavoriteHomeToCurrentUser,

} from './favorite_handle';
import {
  deleteHomeFromDB,
} from './room_upload_delete';

const homeDetailTemplate = require('../templates/home_detail.handlebars');

const {
  getInstance,
} = require('../firebase/firebase');

const firebase = getInstance();


export default () => {
  const currentHomeKey = window.location.href.split('/')[5];
  console.log(currentHomeKey);
  firebase.database().ref(homesPath + currentHomeKey).once('value').then((snapshot) => {
    const home = snapshot.val();

    let isUserTypeStudent = false;

    if (localStorage.getItem('currentUserType') === 'student') {
      isUserTypeStudent = true;
    }
    const isGuest = (localStorage.getItem('guest') === 'true');

    firebase.database().ref(userPath + home.homeownerUID).once('value').then((user) => {
      const roomOwnerInfo = user.val();
      console.log(isGuest);
      console.log(isUserTypeStudent);
      update(compile(homeDetailTemplate)({
        home,
        isGuest,
        isUserTypeStudent,
        roomOwnerInfo,
      }));
      header();
      console.log(isGuest);
      let studentName = '';

      firebase.database().ref(userPath + status.currentUserUid).once('value').then((userStudent) => {
        studentName = `${userStudent.val().firstName} ${userStudent.val().lastName}`;
      });
      // ---------------------------------------------- Event Listener

      shareOnFB();

      if (isGuest === false) {
        const homeownerName = `${roomOwnerInfo.firstName} ${roomOwnerInfo.lastName}`;

        // For Home owner
        const btnsEditHome = [...document.getElementsByClassName('btn__edithome')];
        const btnsDeleteHome = [...document.getElementsByClassName('btn__delete')];
        const btnsAddFav = [...document.getElementsByClassName('btn__addfavorite')];
        const btnShowSendMessage = document.getElementById('btnSendMessage');
        const btnCloseSendMessage = document.getElementById('btnClosePopup');
        const btnSendMessage = document.getElementById('btnSendMessageReal');

        btnSendMessage.addEventListener('click', () => {
          const message = document.getElementById('chat_text').value;
          sendMessage(status.currentUserUid, roomOwnerInfo.userId, message, studentName,
            homeownerName, status.userType);
        });

        btnCloseSendMessage.addEventListener('click', () => {
          document.getElementsByClassName('popup__chat')[0].classList.remove('show__popup--chat');
        });

        btnShowSendMessage.addEventListener('click', () => {
          document.getElementsByClassName('popup__chat')[0].classList.add('show__popup--chat');
        });

        btnsEditHome.forEach((btnEditHome) => {
          btnEditHome.addEventListener('click', () => {
            const selectedHomeKey = btnEditHome.getAttribute('data-homeKey');
            status.currentViewHomeKey = selectedHomeKey;

            console.log(`btnEditHOme owner Clicked --- ${selectedHomeKey}`);
          });
        });

        btnsDeleteHome.forEach((btnDeleteHome) => {
          btnDeleteHome.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedHomeKey = btnDeleteHome.getAttribute('data-homeKey');
            deleteHomeFromDB(selectedHomeKey);
            console.log('btnDeleteHome Clicked');

            window.location.replace('#/home_homeowner');
          });
        });


        btnsAddFav.forEach((btnAddFav) => {
          btnAddFav.addEventListener('click', (e) => {
            const selectedHomeKey = btnAddFav.getAttribute('data-homeKey');
            addFavoriteHomeToCurrentUser(e, status.currentUserUid, selectedHomeKey);
            console.log(`btnAddFavorite Clicked${selectedHomeKey}`);
            window.location.replace('#/home_student');
          });
        });
      }
    });
  });
};
