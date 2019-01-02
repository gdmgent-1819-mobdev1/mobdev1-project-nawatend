// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';
import update from '../helpers/update';

import {
  signIn,
  signInGoogle,
} from './user_sign_in_out';
import {
  requestNotificationPermission,
} from './notification';

// Import the template to use
const startTemplate = require('../templates/start.handlebars');

export default () => {
  // Data to be passed to the template
  const user = 'Nawang';
  // Return the compiled template to the router
  update(compile(startTemplate)({
    user,
  }));

  requestNotificationPermission();
  const btnSignIn = document.getElementById('btnSignIn');
  const btnSignInGoogle = document.getElementById('btnSignInGoogle');
  // const btnForgotPassword = document.getElementById('forgot_password');
  const btnGuestMode = document.getElementById('btnGuestMode');

  btnGuestMode.addEventListener('click', () => {
    localStorage.setItem('guest', true);
  });

  btnSignIn.addEventListener('click', (e) => {
    signIn(e);
    console.log('signin clicked');
    // prepare first to display
    localStorage.setItem('modeRate', true);
    localStorage.setItem('modeMap', false);
    localStorage.setItem('modeList', false);
    localStorage.setItem('modeFavorites', false);
    localStorage.setItem('filtered', false);
    localStorage.setItem('guest', false);
  }, false);

  btnSignInGoogle.addEventListener('click', (e) => {
    signInGoogle(e);
  }, false);
};
