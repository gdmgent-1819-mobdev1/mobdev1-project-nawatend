// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';

import update from '../helpers/update';
import header from '../helpers/header';

// Only import the compile function from handlebars instead of the entire library

import status from './status';
import {
  userPath,
  conversationsPath,
} from './path_db';
import {
  objectToArray,
} from '../helpers/cool_functions';
import {
  sendMessage,
} from '../helpers/message_handle';

const chatTemplate = require('../templates/chat.handlebars');


const {
  getInstance,
} = require('../firebase/firebase');


const firebase = getInstance();


export default () => {
  const database = firebase.database();

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log('user confirm');
      let conversations = [];
      let selectedConversation;
      localStorage.setItem('currentUserUid', user.uid);
      let student = '';

      database.ref(conversationsPath).on('value', (snapshots) => {
        if (snapshots.val() !== null) {
          conversations = [];
          snapshots.forEach((snapshot) => {
            if (snapshot.val().conversationKey.indexOf(user.uid) !== -1) {
              conversations.push(snapshot.val());
            } else {
              console.log(`NOT messages found ${snapshot.val().conversationKey} -- ${user.uid}`);
            }
          });


          if (localStorage.getItem('currentUserType') === 'student') {
            student = true;
          } else {
            student = false;
          }

          update(compile(chatTemplate)({
            conversations,
            student,

          }));
          header();

          const btnsConversation = [...document.getElementsByClassName('conversation__item')];
          const btnSendMessageInChat = document.getElementById('btnSendMessage');
          let selectedConversationKey = '';
          btnsConversation.forEach((btnConversation) => {
            btnConversation.addEventListener('click', () => {
              selectedConversationKey = btnConversation.getAttribute('data-conversationKey');
              database.ref(conversationsPath + selectedConversationKey).on('value', (conversation) => {
                selectedConversation = conversation.val();
                // console.log(selectedConversation);

                const containerChat = document.getElementsByClassName('chat__messages')[0];
                containerChat.innerHTML = '';
                const messagesOfConvo = objectToArray(selectedConversation.messages);

                messagesOfConvo.forEach((mes) => {
                  // console.log(mes.message);
                  const divType = document.createElement('div');
                  const div = document.createElement('div');
                  if (localStorage.getItem('currentUserType') === 'student') {
                    if (mes.userType === 'student') {
                      divType.classList.add('float__right');
                      div.classList.add('message__student');
                    } else {
                      divType.classList.add('float__left');
                      div.classList.add('message__homeowner');
                    }
                  }

                  if (localStorage.getItem('currentUserType') === 'homeOwner') {
                    if (mes.userType === 'homeOwner') {
                      divType.classList.add('float__right');
                      div.classList.add('message__homeowner');
                    } else {
                      divType.classList.add('float__left');
                      div.classList.add('message__student');
                    }
                  }

                  div.innerText = mes.message;
                  divType.appendChild(div);

                  containerChat.appendChild(divType);
                });
              });
            });
          });


          btnSendMessageInChat.addEventListener('click', () => {
            const messageText = document.getElementById('message_tosend').value;
            database.ref(conversationsPath + selectedConversationKey).once('value', (conversation) => {
              console.log('SENT');
              selectedConversation = conversation.val();
              sendMessage(selectedConversation.fromUID, selectedConversation.toUID, messageText, selectedConversation.studentName, selectedConversation.homeownerName, localStorage.getItem('currentUserType'));
            });
          });
        } else {
          if (localStorage.getItem('currentUserType') === 'student') {
            student = true;
          } else {
            student = false;
          }
          update(compile(chatTemplate)({
            conversations,
            student,

          }));
          header();
        }
      });
    } else {
      console.log('no user');
    }
  });
};
