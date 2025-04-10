<template>
    <div class="signup">
      <h2>Sign Up</h2>
      <form @submit.prevent="handleSignup">
        <label>Email:</label>
        <input type="email" v-model="email" required />
  
        <label>Password:</label>
        <input type="password" v-model="password" required />
  
        <button type="submit">Sign Up</button>
        <p v-if="error" style="color: red;">{{ error }}</p>
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
  
  const handleSignup = async () => {
    error.value = null;
    try {
      const res = await auth.createUserWithEmailAndPassword(email.value, password.value);
      console.log("Signed up:", res.user);
      router.push("/");
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
  