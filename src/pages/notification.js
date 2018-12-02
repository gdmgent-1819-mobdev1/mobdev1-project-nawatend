// request Permission to user Notification
export function requestNotificationPermission() {
  if (Notification && Notification.permission === 'default') {
    Notification.requestPermission((permission) => {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
    });
  }
}

// send notification
export function sendNotification(msg) {
  // let notif = new Notification(msg);

  if (Notification.permission === 'granted') {
    const notification = new Notification('Project GoHome', {
      icon: 'http://freeflaticons.com/wp-content/uploads/2014/09/coconut-copy-1410577237kn4g8.png',
      body: msg,
    });

    setTimeout(notification.close.bind(notification), 5000);
  }
}
