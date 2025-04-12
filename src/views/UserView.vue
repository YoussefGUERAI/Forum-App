<template>
    <div v-if="user">
      <nav-bar></nav-bar>
      <h2 >Profile</h2>
      <p class="profile"><strong>Email:</strong> {{ user.email }}</p>
      <p class="profile"><strong>Name:</strong> {{ displayName || "Not set" }}</p>
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
    <h2>Change username:</h2>
    <div>
        <input type="text" v-model="newUserName" placeholder="New Username">
        <button @click="updateUserName">Update Username</button>
        <p>{{ usernameError }}</p>
    </div>
  </template>
  
  <script setup>
  import NavBar from "@/components/NavBar.vue";
  import { ref, onMounted } from "vue";
  import { auth } from "@/firebase/config";
  import firebase from "firebase/app"; 
  import { db } from "@/firebase/config";
  import { useRouter } from "vue-router";
  
  
  const user = ref(null);
  const displayName = ref("");
  const currentPassword = ref("");
  const newPassword = ref("");
  const confirmPassword = ref("");
  const newUserName = ref("");
  const usernameError = ref("");
  const router = useRouter();
  
  onMounted(() => {
    auth.onAuthStateChanged(current => {
      if (current) {
        user.value = current;
        displayName.value = current.displayName;
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

  const updateUserName = async () => {
    usernameError.value = "";

    let takens = ref([]);
    await db.collection("users").get().then((snapshot) => {
      snapshot.forEach((doc) => {
        takens.value.push(doc.data().name);
      })
    });

    if (newUserName.value === "") {
      usernameError.value = "Username cannot be empty!";
      return;
    }
    else if (takens.value.includes(newUserName.value)) {
      usernameError.value = "Username already taken!";
      return;
    }
    else if (newUserName.value.length < 3) {
      usernameError.value = "Username must be at least 3 characters long!";
      return;
    }
    else if (newUserName.value.length > 20) {
      usernameError.value = "Username must be at most 20 characters long!";
      return;
    }
    else if (!/^[a-zA-Z0-9]+$/.test(newUserName.value)) {
      usernameError.value = "Username can only contain letters and numbers!";
      return;
    }
  
    else{
      
      try{
        
        const userRef = db.collection("users").doc(user.value.uid);
        await userRef.update({
          name: newUserName.value
        })
        
        await auth.currentUser.updateProfile({
          displayName: newUserName.value
        })
       displayName.value = newUserName.value;
        alert("Username updated successfully!");
        
        router.push('/profile');
      }
      catch (error) {
        console.error("Error updating username:", error.message);
        alert("Failed to update username: " + error.message);
      }
      

    } 
  }
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