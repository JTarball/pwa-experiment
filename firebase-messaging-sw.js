

// importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
// importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');

// var firebaseConfig = {
//   apiKey: "xxxx",
//   authDomain: "newproject-95acc.firebaseapp.com",
//   databaseURL: "https://newproject-95acc.firebaseio.com",
//   projectId: "newproject-95acc",
//   storageBucket: "newproject-95acc.appspot.com",
//   messagingSenderId: "xxxx",
//   appId: "xxxx"
// };

// firebase.initializeApp(firebaseConfig);

// if (firebase.messaging.isSupported()) {
//   firebase.messaging();
// }



// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

/////////

//import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyCE2gzXEWWcSfh146cUJMSvppM9ORBb2EY",
authDomain: "shadow-app-pwa.firebaseapp.com",
projectId: "shadow-app-pwa",
storageBucket: "shadow-app-pwa.appspot.com",
messagingSenderId: "446689795223",
appId: "1:446689795223:web:6feb71d1b7b823200a9dd2",
measurementId: "G-55P561HDB8"
};



//import { getAnalytics } from "firebase/analytics";





// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics();

const messaging = firebase.messaging();


// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
messaging.getToken({ vapidKey: 'BPRLf00YZTC6FyayPX-NXu8Ykfc1ezNVjes6hiPZh1xrRSBPRN14YCn5BK7XhKaQ-8LQDpUhJeglWqodgwC7C3A' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
    console.log('currentToken', currentToken);
    console.log("GRANTED");
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});


//

self.addEventListener('install', event => {
  console.log('Firebase Service worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Firebase Service worker activating...');
});

// I'm a new service worker

self.addEventListener('fetch', event => {
  console.log('Fetching:', event.request.url);
});


messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
