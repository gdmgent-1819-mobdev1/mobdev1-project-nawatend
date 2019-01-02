import {
  signOut,
} from '../pages/user_sign_in_out';


const header = () => {
  const btnMenu = document.getElementById('menu_bars');
  const menu = document.getElementById('menu');
  const btnSignOut = document.getElementById('btnSignOut');
  const btnChat = document.getElementById('chat');
  const btnLogo = document.getElementById('logo');

  const currentUserName = document.getElementById('currentUserName');
  currentUserName.innerText = localStorage.getItem('currentUserName');

  btnLogo.addEventListener('click', () => {
    window.location.reload('#/');
  });
  btnSignOut.addEventListener('click', () => {
    signOut();
  });

  btnChat.addEventListener('click', () => {

  });

  btnMenu.addEventListener('click', () => {
    console.log('Menu Bars Clicked');
    menu.classList.toggle('menu__active');
  }, false);
};


export default header;
