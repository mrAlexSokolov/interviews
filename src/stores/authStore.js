import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { ref } from "vue";
import { defineStore } from "pinia";
//

//
//
export const useAuthStore = defineStore("auth", () => {
  const userId = ref("");
  const authError = ref(false);
  const toastText = ref("");
  const justRegistered = ref(false);
  // S I G N  I N
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          userId.value = user.uid;
          authError.value = false;
          toastText.value = "";
          justRegistered.value = false;
        } else {
          userId.value = "";
          authError.value = true;
          toastText.value = "Invalid credentinal";
        }
      });
    } catch (error) {
      authError.value = true;
      toastText.value = error.message;
    } finally {
      //
    }
  };
  // S I G N  U P
  const signUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          userId.value = user.uid;
          authError.value = false;
          toastText.value = "";
          justRegistered.value = true;
        } else {
          justRegistered.value = false;
          userId.value = "";
          authError.value = true;
          toastText.value = "Invalid credentinal";
        }
      });
    } catch (error) {
      justRegistered.value = false;
      authError.value = true;
      toastText.value = error.message;
    } finally {
      //
    }
  };
  return { userId, authError, toastText, justRegistered, signIn, signUp };
});
