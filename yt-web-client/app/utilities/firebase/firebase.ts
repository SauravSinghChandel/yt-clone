// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, connectAuthEmulator } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_YT_CLONE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_YT_CLONE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_YT_CLONE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_YT_CLONE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_YT_CLONE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const functions = getFunctions();



/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export async function signInWithGoogle() {
    console.log(auth)
    return await signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
*/
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
