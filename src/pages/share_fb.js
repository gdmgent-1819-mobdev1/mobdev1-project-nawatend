const shareOnFB = () => {
  const btnShareOnFB = document.getElementById('btnShareOnFB');
  const url = window.location.href;

  btnShareOnFB.addEventListener('click', () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`,
      'facebook-share-dialog',
      'width=800,height=600');
    return false;
  });
};


export default shareOnFB;
