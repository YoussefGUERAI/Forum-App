<template>
    <div class="signup">
      <h2>Sign Up</h2>
      <form @submit.prevent="handleSignup">
        <label>Email:</label>
        <input type="email" v-model="email" required />
  
        <label>Password:</label>
        <input type="password" v-model="password" required />

        <label>Name:</label>
      <input type="text" v-model="name" required /><br>

      <label>Age:</label>
      <input type="number" v-model="age" required /><br>
  
        <button type="submit">Sign Up</button>
        <p v-if="error" style="color: red;">{{ error }}</p><p>Already registered ? <router-link to="/login">Log in</router-link> </p>
        
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { auth , db} from "@/firebase/config";
  import { useRouter } from "vue-router";
  
  
  const email = ref("");
  const password = ref("");
  const error = ref(null);
  const router = useRouter();
const name = ref("");
  
  const handleSignup = async () => {
    error.value = null;
    try {
      const res = await auth.createUserWithEmailAndPassword(email.value, password.value);
        // Optionally, you can store additional user info in the database
      const user = res.user;
      await user.updateProfile({displayName: name.value});
        // You can also store age in the database if needed
        await db.collection("users").doc(user.uid).set({
      name: name.value,
      email: user.email,
      createdAt: new Date()
    });

    alert("User registered successfully!");
      console.log("Signed up:", res.user);
      router.push("/home");
    } catch (err) {
      error.value = err.message;
    }
  };
  </script>
  
  <style scoped>
  .signup {
    max-width: 400px;
    margin: 30px auto;
  }
  input {
    display: block;
    margin-bottom: 10px;
    padding: 8px;
    width: 100%;
  }
  button {
    padding: 8px 16px;
  }
  </style>