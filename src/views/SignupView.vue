<template>
  <div class="container mt-5" style="max-width: 500px;">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4 text-center">Sign Up</h2>
      <form @submit.prevent="handleSignup">
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

        <div class="mb-3">
          <label for="name" class="form-label">Name:</label>
          <input
            id="name"
            type="text"
            v-model="name"
            class="form-control"
            required
          />
        </div>

        <div class="mb-3">
          <label for="age" class="form-label">Age:</label>
          <input
            id="age"
            type="number"
            v-model="age"
            class="form-control"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary w-100">Sign Up</button>

        <p v-if="error" class="text-danger mt-2">{{ error }}</p>

        <p class="mt-3 text-center">
          Already registered?
          <router-link to="/login">Log in</router-link>
        </p>
      </form>
    </div>
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
      role: "user",
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