import Navigo from 'navigo';
import handlebars, {
  compile,
} from 'handlebars';
import './styles/main.sass';

import routes from './routes';
import {
  objectToArray,
} from './helpers/cool_functions';
// Partials
const header = require('./partials/header.handlebars');
const footer = require('./partials/footer.handlebars');

const chatBox = require('./partials/chat_box.handlebars');

// Register the partial components
handlebars.registerPartial('header', compile(header)({}));
handlebars.registerPartial('footer', compile(footer)({
  text: 'Template made with love by GDM Ghent',
}));
handlebars.registerPartial('chatBox', compile(chatBox)({
  title: 'Chat box',
}));

handlebars.registerHelper('lastmessage', (object) => {
  const objToArr = objectToArray(object);
  return objToArr[objToArr.length - 1].message;
});

handlebars.registerHelper('lastmessageTime', (object) => {
  const objToArr = objectToArray(object);
  return objToArr[objToArr.length - 1].time;
});

// Router logic to load the correct template when needed
const router = new Navigo(window.location.origin, true);

routes.forEach((route) => {
  router.on(route.path, () => {
    route.view();
    router.updatePageLinks();
  });
});

// This catches all non-existing routes and redirects back to the home
router.notFound(() => {
  router.navigate('/');
});

router.resolve();
window.onload = () => {
  router.navigate(window.location.hash.split('/')[1]);
};
