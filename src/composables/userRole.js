import { ref, onMounted } from "vue";
import { auth, db } from "@/firebase/config";

const isModerator = ref(false);
const loaded = ref(false); // ✅ new flag

export function useUserRole() {
  onMounted(() => {
    const checkRole = async (user) => {
      if (user) {
        try {
          const doc = await db.collection("users").doc(user.uid).get();
          if (doc.exists && doc.data().role === "moderator") {
            isModerator.value = true;
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
      loaded.value = true; 
    };

    const user = auth.currentUser;
    if (user) {
      checkRole(user);
    } else {
      auth.onAuthStateChanged((user) => {
        checkRole(user);
      });
    }
  });

  return { isModerator, loaded };
}
