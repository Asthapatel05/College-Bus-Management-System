// // Firebase configuration
// // You'll need to replace these values with your own Firebase project config
// const firebaseConfig = {
    // apiKey: "AIzaSyB5cxsTaQrC9mMlgXh7zyN1OWYWDvEZZr0",
    // authDomain: "college-bus-management-c2a1f.firebaseapp.com",
    // projectId: "college-bus-management-c2a1f",
    // storageBucket: "college-bus-management-c2a1f.firebasestorage.app",
    // messagingSenderId: "180365718829",
    // appId: "1:180365718829:web:9726ebd395f10352e20fa4",
    // measurementId: "G-C58S70M6LC"
// };

// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// // Global references to Firebase services
// const auth = firebase.auth();
// const db = firebase.firestore();

// // Define database collections
// const usersCollection = db.collection('users');
// const busesCollection = db.collection('buses');

// // Admin email for access control (replace with your admin email)
// const ADMIN_EMAIL = "yogiraj@gmail.com";

// // Helper function to check if current user is admin
// function isAdmin() {
//     const user = auth.currentUser;
//     const isAdminUser = user && user.email === ADMIN_EMAIL;
//     console.log('Checking admin status:', user ? user.email : 'No user', 'Admin email match:', isAdminUser);
//     return isAdminUser;
// }

// // Helper function to get current user data
// async function getCurrentUserData() {
//     const user = auth.currentUser;
//     if (!user) return null;
    
//     const userDoc = await usersCollection.doc(user.uid).get();
    
//     // If user exists but admin status might need updating
//     if (userDoc.exists) {
//         const userData = userDoc.data();
//         // Check if this is the admin email but isAdmin flag is not set
//         if (user.email === ADMIN_EMAIL && !userData.isAdmin) {
//             console.log('Updating admin status for:', user.email);
//             await usersCollection.doc(user.uid).update({
//                 isAdmin: true
//             });
//             userData.isAdmin = true;
//         }
//         return userData;
//     } else {
//         // Create user profile if it doesn't exist (fallback)
//         const isAdminUser = user.email === ADMIN_EMAIL;
//         const newUserData = {
//             name: user.displayName || user.email.split('@')[0],
//             email: user.email,
//             passId: null,
//             isAdmin: isAdminUser
//         };
        
//         await usersCollection.doc(user.uid).set(newUserData);
//         console.log('Created new user profile for:', user.email);
//         return newUserData;
//     }
// }






// Firebase configuration - Replace with your actual Firebase project config
const firebaseConfig = {

  // apiKey: "AIzaSyD4ag1ditn5XuUQvPLnHdSJPgvWApe1jNQ",
  // authDomain: "bus-management-yogi.firebaseapp.com",
  // projectId: "bus-management-yogi",
  // storageBucket: "bus-management-yogi.firebasestorage.app",
  // messagingSenderId: "86401600631",
  // appId: "1:86401600631:web:c849b97981be5c35938a72"

    apiKey: "AIzaSyB5cxsTaQrC9mMlgXh7zyN1OWYWDvEZZr0",
    authDomain: "college-bus-management-c2a1f.firebaseapp.com",
    projectId: "college-bus-management-c2a1f",
    storageBucket: "college-bus-management-c2a1f.firebasestorage.app",
    messagingSenderId: "180365718829",
    appId: "1:180365718829:web:9726ebd395f10352e20fa4",
    measurementId: "G-C58S70M6LC"

    // apiKey: "AIzaSyA5epiOZtInbrQ20-LDYcJk9Pq8rFQzwQo",
    // authDomain: "collegebusmang.firebaseapp.com",
    // projectId: "collegebusmang",
    // storageBucket: "collegebusmang.firebasestorage.app",
    // messagingSenderId: "402871123229",
    // appId: "1:402871123229:web:cba612f01ffa7101e975f4"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firebase Auth
  const auth = firebase.auth();
  
  // Initialize Firestore - Make sure the Firestore SDK is loaded
  let db;
  let usersCollection;
  
  // Function to initialize Firestore when the SDK is available
  function initializeFirestore() {
    try {
      // Check if the Firestore SDK is available
      if (typeof firebase.firestore === 'function') {
        db = firebase.firestore();
        usersCollection = db.collection('users');
        console.log('Firestore initialized successfully');
      } else {
        console.error('Firebase Firestore SDK not loaded');
      }
    } catch (error) {
      console.error('Error initializing Firestore:', error);
    }
  }
  
  // Function to get current user data from Firestore
  async function getCurrentUserData() {
    try {
      // Make sure Firestore is initialized before using it
      if (!db || !usersCollection) {
        console.log('Firestore not initialized yet, initializing now...');
        initializeFirestore();
        
        // If still not initialized, return null
        if (!db || !usersCollection) {
          console.error('Could not initialize Firestore');
          return null;
        }
      }
      
      const user = auth.currentUser;
      if (user) {
        const doc = await usersCollection.doc(user.uid).get();
        if (doc.exists) {
          return doc.data();
        } else {
          console.log('No user data found in Firestore');
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
  
  // Try to initialize Firestore after a small delay to ensure the SDK is loaded
  // setTimeout(initializeFirestore, 1000);
  
  // Export the functions and objects
  window.getCurrentUserData = getCurrentUserData;
  window.auth = auth;