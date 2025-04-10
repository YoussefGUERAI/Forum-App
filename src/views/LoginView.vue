<template>
    <div class="login">
      <h2>Log In</h2>
      <form @submit.prevent="handleLogin">
        <label>Email:</label>
        <input type="email" v-model="email" required />
  
        <label>Password:</label>
        <input type="password" v-model="password" required />
  
        <button type="submit">Log In</button>
        <p v-if="error" style="color: red;">{{ error }}</p>
        <p>Not registered yet ? <router-link to="/">Sign up</router-link> </p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { auth } from "@/firebase/config";
  import { useRouter } from "vue-router";
  
  const email = ref("");
  const password = ref("");
  const error = ref(null);
  const router = useRouter();
  
  const handleLogin = async () => {
    error.value = null;
    try {
      const res = await auth.signInWithEmailAndPassword(email.value, password.value);
      console.log("Logged in:", res.user);
      router.push("/home");
    } catch (err) {
      error.value = err.message;
    }
  };
  </script>
  
  <style scoped>
  .login {
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
  