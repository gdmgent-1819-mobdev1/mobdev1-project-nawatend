// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';
import update from '../helpers/update';

import {
  forgottenPasswordHandle,
} from './user_sign_in_out';
import status from './status';

// Import the template to use
const forgotPasswordTemplate = require('../templates/forgot_password.handlebars');

export default () => {
  // Data to be passed to the template

  // Return the compiled template to the router
  update(compile(forgotPasswordTemplate)({

  }));


  const btnSendReset = document.getElementById('btnSendReset');

  btnSendReset.addEventListener('click', () => {
    const email = document.getElementById('signin_email').value;
    // send reset email
    forgottenPasswordHandle(email);
  });
};
