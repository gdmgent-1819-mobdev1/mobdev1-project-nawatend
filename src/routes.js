// Pages
import StartView from './pages/start';
import RegisterView from './pages/user_register';

import HomeStudent from './pages/home_student';
import HomeHomeOwner from './pages/home_homeowner';
import HomeDetailView from './pages/home_detail';
import HomeEditView from './pages/home_edit';
import HomeGuestView from './pages/home_guest';
import ForgotPasswordView from './pages/forgot_password';
import ChatView from './pages/chat';


// modes


export default [{
  path: '/',
  view: StartView,
},
{
  path: '/register',
  view: RegisterView,
},
{
  path: '/home_detail/:homeId',
  view: HomeDetailView,
},
{
  path: '/home_student',
  view: HomeStudent,
},
{
  path: '/home_homeowner',
  view: HomeHomeOwner,
},
{
  path: '/home_edit/:homeId',
  view: HomeEditView,
},
{
  path: '/home_guest',
  view: HomeGuestView,
},
{
  path: '/forgot_password',
  view: ForgotPasswordView,
},
{
  path: '/chat',
  view: ChatView,
},

];
