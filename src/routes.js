// Pages
import StartView from './pages/start';
import AboutView from './pages/about';
import FirebaseView from './pages/firebase-example';
import MapboxView from './pages/mapbox-example';
import TestPageView from './pages/testPage';
import RegisterView from './pages/user_register';
import HomeView from './pages/home';

export default [{
  path: '/',
  view: StartView,
},
{
  path: '/about',
  view: AboutView,
},
{
  path: '/firebase',
  view: FirebaseView,
},
{
  path: '/mapbox',
  view: MapboxView,
},
{
  path: '/testPage',
  view: TestPageView,
},
{

  path: '/register',
  view: RegisterView,

},
{
  path: '/home',
  view: HomeView,
},
];
