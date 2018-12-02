// Only import the compile function from handlebars instead of the entire library
import {
  compile,
} from 'handlebars';

// Import the update helper
import update from '../helpers/update';

const {
  getInstance,
} = require('../firebase/firebase');

const firebase = getInstance();
// Import the template to use
const aboutTemplate = require('../templates/list.handlebars');

export default () => {
  // Data to be passed to the template
  let loading = true;
  let homes = {};
  const title = 'Firebase calls example';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({
    title,
    loading,
    homes,
  }));


  if (firebase) {
    // firebase.auth().createUserWithEmailAndPassword('test@test.com', 'test333').catch((error) => {
    //   // Handle Errors here.
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   console.log(errorCode,errorMessage);
    // });

    const database = firebase.database().ref('/posts');
    database.on('value', (snapshot) => {
      homes = snapshot.val();
      loading = false;
      // Run the update helper to update the template
      update(compile(aboutTemplate)({
        title,
        loading,
        homes,
      }));
    });
  }
};
