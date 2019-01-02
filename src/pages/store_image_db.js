const {
  getInstance,
} = require('../firebase/firebase');


const firebase = getInstance();
// store image to storage and  get download link
export default function storeImageToDB(upload, uploadProgress) {
  let imagePathInStorage;
  // const uploadProgress = document.getElementById('upload_progress');
  if (firebase) {
    upload.addEventListener('change', (evt) => {
      if (upload.value !== '') {
        const fileName = evt.target.files[0].name.replace(/\s+/g, '-').toLowerCase();
        const storageRef = firebase.storage().ref(`images/${fileName}`);

        const progress = storageRef.put(evt.target.files[0]);

        progress.then(() => {
          imagePathInStorage = `images/${fileName}`;
          // console.log(imagePathInDB);
          const storageImage = firebase.storage().ref(imagePathInStorage);
          storageImage.getDownloadURL().then((url) => {
            // store current imagelink naar localstorage
            localStorage.setItem('imageLink', url);
          });
        });

        progress.on('state_changed', (snapshot) => {
          const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // eslint-disable-next-line no-param-reassign
          uploadProgress.value = percent;
          console.log(percent);
        });
      } else {
        console.log('emptyy');
      }
    });

    // el.addEventListener('change', () => {
    //   if (el.value !== '') {
    //     const fileName = el.files[0].name.replace(/\s+/g, '-').toLowerCase();

    //     const storageRef = firebase.storage().ref(`images/${fileName}`);

    //     storageRef.put(el.files[0]);

    //     imagePathInDB = `images/${fileName}`;
    //     console.log(`Stored Image: ${fileName} And Path in DB: ${imagePathInDB}`);


    //     const storageImage = firebase.storage().ref(imagePathInDB);
    //     storageImage.getDownloadURL().then((url) => {
    //       // Store
    //       localStorage.setItem('imageLink', url);
    //       // Store
    //       sessionStorage.setItem('imageLink', url);
    //     });
    //   }
    // });
  }
  // imageLink = localStorage.getItem('imageLink');

  // return imageLink;
}
