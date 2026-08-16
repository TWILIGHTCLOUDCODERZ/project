import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBwxomNU21-YqdmkSUI6ROsoMupo0AnpQ4',
  authDomain: 'deepan-gemini-xprize.firebaseapp.com',
  projectId: 'deepan-gemini-xprize',
  storageBucket: 'deepan-gemini-xprize.firebasestorage.app',
  messagingSenderId: '807655655153',
  appId: '1:807655655153:web:8dde92ee27c6ef614b0b50',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
