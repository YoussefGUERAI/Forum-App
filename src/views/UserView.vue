<template>
  <div v-if="user">
    <nav-bar></nav-bar>

    <div class="container mt-4">
      <div class="card shadow-sm p-4 mb-4">
        <h2 class="card-title mb-3">Profile</h2>
        <p class="mb-2"><strong>Email:</strong> {{ user.email }}</p>
        <p class="mb-2"><strong>Name:</strong> {{ user.displayName || "Not set" }}</p>
        <img v-if="user.photoURL" :src="user.photoURL" alt="Profile Picture" class="img-thumbnail" width="120" />
      </div>

      <div class="card shadow-sm p-4">
        <h3 class="mb-3">Change Password</h3>

        <div class="mb-3">
          <label for="currentPassword" class="form-label">Current Password</label>
          <input type="password" id="currentPassword" v-model="currentPassword" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="newPassword" class="form-label">New Password</label>
          <input type="password" id="newPassword" v-model="newPassword" class="form-control" />
        </div>

        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" class="form-control" />
        </div>

        <button class="btn btn-primary" @click="updatePassword">Update Password</button>
      </div>
    </div>
  </div>
</template>

  
  <script setup>
  import NavBar from "@/components/NavBar.vue";
  import { ref, onMounted } from "vue";
  import { auth } from "@/firebase/config";
  import firebase from "firebase/app"; // you need this for EmailAuthProvider
  
  const user = ref(null);
  const currentPassword = ref("");
  const newPassword = ref("");
  const confirmPassword = ref("");
  
  onMounted(() => {
    auth.onAuthStateChanged(current => {
      if (current) {
        user.value = current;
      }
    });
  });
  
  const updatePassword = async () => {
    if (newPassword.value !== confirmPassword.value) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.value.email,
        currentPassword.value
      );
  
      // Re-authenticate the user
      await user.value.reauthenticateWithCredential(credential);
  
      // Now update the password
      await user.value.updatePassword(newPassword.value);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error.message);
      alert("Failed to update password: " + error.message);
    }
  };
  </script>
