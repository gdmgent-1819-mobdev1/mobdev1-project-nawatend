// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';
import update from '../helpers/update';

import {
  signIn,
  signInGoogle,
} from './user_sign_in_out';

import Home from './home';
// Import the template to use
const startTemplate = require('../templates/start.handlebars');

export default () => {
  // Data to be passed to the template
  const user = 'Nawang';
  // Return the compiled template to the router
  update(compile(startTemplate)({
    user,
  }));


  const btnSignIn = document.getElementById('btnSignIn');
  const btnSignInGoogle = document.getElementById('btnSignInGoogle');

  btnSignIn.addEventListener('click', (e) => {
    signIn(e);


    console.log('signin clicked');
  }, false);

  btnSignInGoogle.addEventListener('click', (e) => {
    signInGoogle(e);
  }, false);
};
