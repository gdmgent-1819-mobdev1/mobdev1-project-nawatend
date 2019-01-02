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
export function sendNotification(msg, isNegativeMessage = false) {
  // let notif = new Notification(msg);

  if (Notification.permission === 'granted') {
    if (isNegativeMessage) {
      const notification = new Notification('Project GoHome', {
        icon: '../src/assets/images/warning.svg',
        body: msg,
      });

      setTimeout(notification.close.bind(notification), 4000);
    } else {
      const notification = new Notification('Project GoHome', {
        icon: '../src/assets/images/confirm.svg',
        body: msg,
      });

      setTimeout(notification.close.bind(notification), 4000);
    }
  }
}
