<template>
    <div v-if="user">
      <nav-bar></nav-bar>
      <h2 >Profile</h2>
      <p class="profile"><strong>Email:</strong> {{ user.email }}</p>
      <p class="profile"><strong>Name:</strong> {{ user.displayName || "Not set" }}</p>
      <img v-if="user.photoURL" :src="user.photoURL" alt="Profile Picture" width="100" />
    </div>
  
    <h2>Change Password:</h2>
    <div>
      <label for="currentPassword">Current Password:</label>
      <input type="password" v-model="currentPassword" /><br>
  
      <label for="newPassword">New Password:</label>
      <input type="password" v-model="newPassword" /><br>
  
      <label for="confirmPassword">Confirm Password:</label>
      <input type="password" v-model="confirmPassword" /><br>
  
      <button @click="updatePassword">Update Password</button>
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
<style scoped>
    
    .profile {
        max-width: 400px;
        margin: 30px auto;
        text-align: center; /* Add this line to center the profile section */
    }
    input {
        display: block;
        margin: 0 auto; /* Add this line to center the input fields */
        margin-bottom: 10px;
        padding: 8px;
        width: 50%;
    }
    button {
        display: block;
        margin: 0 auto; /* Add this line to center the button */
        padding: 8px 16px;
    }
    </style>