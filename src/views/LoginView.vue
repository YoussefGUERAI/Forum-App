<template>
  <div class="container mt-5" style="max-width: 500px;">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4 text-center">Log In</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="email" class="form-label">Email:</label>
          <input
            id="email"
            type="email"
            v-model="email"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="password" class="form-label">Password:</label>
          <input
            id="password"
            type="password"
            v-model="password"
            class="form-control"
            required
          />
        </div>

        <button class="btn btn-primary w-100" type="submit">Log In</button>

        <p v-if="error" class="text-danger mt-2">{{ error }}</p>

        <p class="mt-3 text-center">
          Not registered yet?
          <router-link to="/">Sign up</router-link>
        </p>
      </form>
    </div>
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
  
  